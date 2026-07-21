const std = @import("std");
const tree_mod = @import("tree.zig");
const DomTree = tree_mod.DomTree;
const NodeData = tree_mod.NodeData;
const QualName = tree_mod.QualName;

pub fn parseHtml(allocator: std.mem.Allocator, input: []const u8) !*DomTree {
    const dom = try DomTree.init(allocator);

    var pos: usize = 0;
    var current_parent = dom.document;

    // Simple HTML5Tokenizer / Tree construction parser
    while (pos < input.len) {
        if (input[pos] == '<') {
            if (pos + 4 <= input.len and std.mem.eql(u8, input[pos .. pos + 4], "<!--")) {
                // Comment
                const end_idx = std.mem.indexOf(u8, input[pos + 4 ..], "-->") orelse (input.len - pos - 4);
                const comment_text = input[pos + 4 .. pos + 4 + end_idx];
                const cid = try dom.newNode(NodeData{ .Comment = .{ .contents = comment_text } });
                try dom.appendChild(current_parent, cid);
                pos += 4 + end_idx + 3;
            } else if (pos + 2 <= input.len and input[pos + 1] == '/') {
                // End tag
                const tag_end = std.mem.indexOf(u8, input[pos + 2 ..], ">") orelse (input.len - pos - 2);
                pos += 2 + tag_end + 1;
                // Pop parent
                if (dom.nodes.items[current_parent.index()]) |pnode| {
                    if (pnode.parent) |grandparent| {
                        current_parent = grandparent;
                    }
                }
            } else if (pos + 2 <= input.len and input[pos + 1] == '!') {
                // Doctype or CDATA
                const end_idx = std.mem.indexOf(u8, input[pos..], ">") orelse (input.len - pos);
                const dt_id = try dom.newNode(NodeData{
                    .Doctype = .{
                        .name = "html",
                        .public_id = "",
                        .system_id = "",
                    },
                });
                try dom.appendChild(dom.document, dt_id);
                pos += end_idx + 1;
            } else {
                // Start tag
                const tag_end = std.mem.indexOf(u8, input[pos + 1 ..], ">") orelse (input.len - pos - 1);
                const tag_content = std.mem.trim(u8, input[pos + 1 .. pos + 1 + tag_end], " ");
                pos += 1 + tag_end + 1;

                var name_end: usize = 0;
                while (name_end < tag_content.len and tag_content[name_end] != ' ' and tag_content[name_end] != '/') : (name_end += 1) {}
                const tag_name = tag_content[0..name_end];

                const elem_id = try dom.newNode(NodeData{
                    .Element = .{
                        .name = QualName{ .local = tag_name },
                        .attrs = &[_]tree_mod.Attribute{},
                    },
                });
                try dom.appendChild(current_parent, elem_id);

                const is_void = std.mem.eql(u8, tag_name, "img") or std.mem.eql(u8, tag_name, "input") or
                    std.mem.eql(u8, tag_name, "br") or std.mem.eql(u8, tag_name, "hr") or
                    std.mem.eql(u8, tag_name, "meta") or std.mem.eql(u8, tag_name, "link");

                if (!is_void) {
                    current_parent = elem_id;
                }
            }
        } else {
            // Text node
            const next_tag = std.mem.indexOfScalar(u8, input[pos..], '<') orelse (input.len - pos);
            const text_slice = input[pos .. pos + next_tag];
            if (text_slice.len > 0) {
                try dom.appendText(current_parent, text_slice);
            }
            pos += next_tag;
        }
    }

    return dom;
}

pub fn parseFragment(allocator: std.mem.Allocator, input: []const u8, context_element: []const u8) !*DomTree {
    _ = context_element;
    return parseHtml(allocator, input);
}
