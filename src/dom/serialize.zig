const std = @import("std");
const tree_mod = @import("tree.zig");
const DomTree = tree_mod.DomTree;
const NodeId = tree_mod.NodeId;

pub fn escapeText(allocator: std.mem.Allocator, s: []const u8) ![]u8 {
    var out = std.ArrayList(u8).init(allocator);
    for (s) |c| {
        switch (c) {
            '&' => try out.appendSlice("&amp;"),
            '<' => try out.appendSlice("&lt;"),
            '>' => try out.appendSlice("&gt;"),
            else => try out.append(c),
        }
    }
    return out.toOwnedSlice();
}

pub fn escapeAttr(allocator: std.mem.Allocator, s: []const u8) ![]u8 {
    var out = std.ArrayList(u8).init(allocator);
    for (s) |c| {
        switch (c) {
            '&' => try out.appendSlice("&amp;"),
            '<' => try out.appendSlice("&lt;"),
            '>' => try out.appendSlice("&gt;"),
            '"' => try out.appendSlice("&quot;"),
            else => try out.append(c),
        }
    }
    return out.toOwnedSlice();
}

pub fn outerHtml(tree: *DomTree, node_id: NodeId, allocator: std.mem.Allocator) ![]u8 {
    tree.mutex.lock();
    defer tree.mutex.unlock();

    var out = std.ArrayList(u8).init(allocator);

    var stack = std.ArrayList(NodeId).init(allocator);
    defer stack.deinit();

    try stack.append(node_id);

    while (stack.popOrNull()) |curr| {
        if (tree.nodes.items[curr.index()]) |node| {
            switch (node.data) {
                .Document => {},
                .Doctype => |d| {
                    try out.writer().print("<!DOCTYPE {s}>", .{d.name});
                },
                .Element => |el| {
                    try out.writer().print("<{s}", .{el.name.local});
                    for (el.attrs) |attr| {
                        const val_esc = try escapeAttr(allocator, attr.value);
                        defer allocator.free(val_esc);
                        try out.writer().print(" {s}=\"{s}\"", .{ attr.name.local, val_esc });
                    }
                    try out.append('>');

                    var child = node.first_child;
                    while (child) |cid| {
                        const child_html = try outerHtmlUnlocked(tree, cid, allocator);
                        defer allocator.free(child_html);
                        try out.appendSlice(child_html);
                        child = if (tree.nodes.items[cid.index()]) |cn| cn.next_sibling else null;
                    }

                    const is_void = std.mem.eql(u8, el.name.local, "img") or std.mem.eql(u8, el.name.local, "input") or
                        std.mem.eql(u8, el.name.local, "br") or std.mem.eql(u8, el.name.local, "hr") or
                        std.mem.eql(u8, el.name.local, "meta") or std.mem.eql(u8, el.name.local, "link");
                    if (!is_void) {
                        try out.writer().print("</{s}>", .{el.name.local});
                    }
                },
                .Text => |t| {
                    const txt_esc = try escapeText(allocator, t.contents.items);
                    defer allocator.free(txt_esc);
                    try out.appendSlice(txt_esc);
                },
                .Comment => |c| {
                    try out.writer().print("<!--{s}-->", .{c.contents});
                },
                .ProcessingInstruction => |pi| {
                    try out.writer().print("<?{s} {s}?>", .{ pi.target, pi.data });
                },
            }
        }
    }

    return out.toOwnedSlice();
}

fn outerHtmlUnlocked(tree: *DomTree, node_id: NodeId, allocator: std.mem.Allocator) ![]u8 {
    var out = std.ArrayList(u8).init(allocator);

    if (tree.nodes.items[node_id.index()]) |node| {
        switch (node.data) {
            .Document => {},
            .Doctype => |d| {
                try out.writer().print("<!DOCTYPE {s}>", .{d.name});
            },
            .Element => |el| {
                try out.writer().print("<{s}", .{el.name.local});
                for (el.attrs) |attr| {
                    const val_esc = try escapeAttr(allocator, attr.value);
                    defer allocator.free(val_esc);
                    try out.writer().print(" {s}=\"{s}\"", .{ attr.name.local, val_esc });
                }
                try out.append('>');

                var child = node.first_child;
                while (child) |cid| {
                    const child_html = try outerHtmlUnlocked(tree, cid, allocator);
                    defer allocator.free(child_html);
                    try out.appendSlice(child_html);
                    child = if (tree.nodes.items[cid.index()]) |cn| cn.next_sibling else null;
                }

                const is_void = std.mem.eql(u8, el.name.local, "img") or std.mem.eql(u8, el.name.local, "input") or
                    std.mem.eql(u8, el.name.local, "br") or std.mem.eql(u8, el.name.local, "hr") or
                    std.mem.eql(u8, el.name.local, "meta") or std.mem.eql(u8, el.name.local, "link");
                if (!is_void) {
                    try out.writer().print("</{s}>", .{el.name.local});
                }
            },
            .Text => |t| {
                const txt_esc = try escapeText(allocator, t.contents.items);
                defer allocator.free(txt_esc);
                try out.appendSlice(txt_esc);
            },
            .Comment => |c| {
                try out.writer().print("<!--{s}-->", .{c.contents});
            },
            .ProcessingInstruction => |pi| {
                try out.writer().print("<?{s} {s}?>", .{ pi.target, pi.data });
            },
        }
    }

    return out.toOwnedSlice();
}

pub fn innerHtml(tree: *DomTree, node_id: NodeId, allocator: std.mem.Allocator) ![]u8 {
    tree.mutex.lock();
    defer tree.mutex.unlock();

    var out = std.ArrayList(u8).init(allocator);

    if (tree.nodes.items[node_id.index()]) |node| {
        var child = node.first_child;
        while (child) |cid| {
            const child_html = try outerHtmlUnlocked(tree, cid, allocator);
            defer allocator.free(child_html);
            try out.appendSlice(child_html);
            child = if (tree.nodes.items[cid.index()]) |cn| cn.next_sibling else null;
        }
    }

    return out.toOwnedSlice();
}
