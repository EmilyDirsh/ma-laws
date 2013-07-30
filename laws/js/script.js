// Generated by CoffeeScript 1.6.3
(function() {
  var Routes, View, body, db, routes, start, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    _this = this;

  db = false;

  View = (function(_super) {
    __extends(View, _super);

    function View() {
      _ref = View.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    View.prototype.initialize = function() {
      this.render = this.options.render;
      this.routes = this.options.routes;
      return true;
    };

    View.prototype.events = {
      'click .bodyLink': 'movePage'
    };

    View.prototype.movePage = function(a) {
      a.preventDefault();
      return routes.navigate(a.target.id, {
        trigger: true
      });
    };

    View.prototype.template = {
      section: Mustache.compile("<div class=\"row\">\n<ul class=\"breadcrumb\">\n  			<li><a class='bodyLink' href=\"../../../../GeneralLaws\" id=\"GeneralLaws\">General Laws</a></li>\n  			<li><a class='bodyLink' href='../../../Part{{part}}' id=\"/GeneralLaws/Part{{part}}\">Part {{part}}</a></li>\n  			<li><a class='bodyLink' href='../../Title{{title}}' id=\"/GeneralLaws/Part{{part}}/Title{{title}}\">Title {{title}}</a></li>\n  			<li><a class='bodyLink' href='../Chapter{{chapter}}' id=\"/GeneralLaws/Part{{part}}/Title{{title}}/Chapter{{chapter}}\">Chapter {{chapter}}</a></li>\n  			<li class=\"active\">Section {{section}}</li>\n</ul>\n<h1>Section {{section}}</h1>\n{{#desc}}<h2>{{desc}}</h2>{{/desc}}\n{{#text}}<p>{{text}}</p>{{/text}}\n</div>"),
      chapter: Mustache.compile("<div class=\"row\">\n<ul class=\"breadcrumb\">\n  			<li><a class='bodyLink' href=\"../../../GeneralLaws\" id=\"GeneralLaws\">General Laws</a></li>\n  			<li><a class='bodyLink' href='../../Part{{doc.part}}' id=\"/GeneralLaws/Part{{pat}}\">Part {{pat}}</a></li>\n  			<li><a class='bodyLink' href='../Title{{doc.title}}' id=\"/GeneralLaws/Part{{pat}}/Title{{tit}}\">Title {{tit}}</a></li>\n  			<li class=\"active\">Chapter {{chap}}</li>\n</ul>\n<h1>Chapter {{chap}}</h1>\n<dl>\n{{#rows}}\n{{#doc.desc}}<dt><strong>Section {{doc.section}}:</strong> <a class='bodyLink' href='Chapter{{doc.chapter}}/Section{{doc.section}}' id='GeneralLaws/Part{{doc.part}}/Title{{doc.title}}/Chapter{{doc.chapter}}/Section{{doc.section}}'>{{doc.desc}}</a></dt>{{/doc.desc}}\n{{#doc.text}}<dd>{{doc.text}}</dd>{{/doc.text}}\n{{/rows}}\n</dl>\n</div>"),
      title: Mustache.compile("<div class=\"row\">\n<ul class=\"breadcrumb\">\n  			<li><a class='bodyLink' href=\"../../GeneralLaws\" id=\"GeneralLaws\">General Laws</a></li>\n  			<li><a class='bodyLink' href='../Part{{tp}}' id=\"/GeneralLaws/Part{{tp}}\">Part {{tp}}</a></li>\n  			\n  			<li class=\"active\">Title {{t}}</li>\n</ul>\n<h1>Title {{t}}</h1>\n<ul>\n{{#row}}\n	<li>\n	<a class='bodyLink' href='Title{{title}}/Chapter{{chapter}}' id=\"GeneralLaws/Part{{part}}/Title{{title}}/Chapter{{chapter}}\">\n		Chapter {{chapter}}\n	</a>\n	</li>\n{{/row}}\n</ul>\n</div>"),
      part: Mustache.compile("<div class=\"row\">\n<ul class=\"breadcrumb\">\n  			<li><a class='bodyLink' href=\"../GeneralLaws\" id=\"GeneralLaws\">General Laws</a></li>\n  			\n  			\n  			<li class=\"active\">Part {{p}}</li>\n</ul>\n<h1>Part {{p}}</h1>\n<ul>\n{{#rowp}}\n	<li>\n	<a class='bodyLink' href='Part{{part}}/Title{{title}}' id=\"GeneralLaws/Part{{part}}/Title{{title}}\">\n		Title {{title}}\n	</a>\n	</li>\n{{/rowp}}\n</ul>\n</div>"),
      general: Mustache.compile("<div class=\"row\">\n<ul class=\"breadcrumb\">\n  			<li class=\"active\">General Laws</li>\n</ul>\n<h1>General Laws</h1>\n<ul>\n{{#rowg}}\n	<li>\n	<a class='bodyLink' href='GeneralLaws/Part{{part}}' id=\"GeneralLaws/Part{{part}}\">\n		Part {{part}}\n	</a>\n	</li>\n{{/rowg}}\n</ul>\n</div>")
    };

    return View;

  })(Backbone.View);

  body = new View({
    render: function(loc) {
      var id, opts, type;
      if (loc.section !== 'all') {
        id = "" + loc.type + "/Part" + loc.part + "/Title" + loc.title + "/Chapter" + loc.chapter + "/Section" + loc.section;
        return db.get(id, function(err, doc) {
          if (err) {

          } else {
            return body.$el.html(body.template.section(doc));
          }
        });
      } else if (loc.section === 'all' && loc.chapter !== 'all') {
        if (loc.type = 'GeneralLaws') {
          type = 'general';
        } else {
          type = loc.type;
        }
        opts = {
          startkey: [type, loc.part, loc.title, loc.chapter.toString()],
          endkey: [type, loc.part, loc.title, loc.chapter.toString(), {}],
          reduce: false,
          include_docs: true
        };
        return db.query("laws/all", opts, function(err, resp) {
          resp.chap = loc.chapter;
          resp.tit = loc.title;
          resp.pat = loc.part;
          return body.$el.html(body.template.chapter(resp));
        });
      } else if (loc.chapter === 'all' && loc.title !== 'all') {
        if (loc.type = 'GeneralLaws') {
          type = 'general';
        } else {
          type = loc.type;
        }
        opts = {
          startkey: [type, loc.part, loc.title],
          endkey: [type, loc.part, loc.title, {}],
          group_level: 4
        };
        return db.query("laws/all", opts, function(err, resp) {
          var rows;
          rows = resp.rows.map(function(row) {
            var out;
            out = {};
            out.chapter = row.key.pop();
            out.title = row.key.pop();
            out.part = row.key.pop();
            return out;
          });
          return body.$el.html(body.template.title({
            row: rows,
            t: loc.title,
            tp: loc.part
          }));
        });
      } else if (loc.title === 'all' && loc.part !== 'all') {
        if (loc.type = 'GeneralLaws') {
          type = 'general';
        } else {
          type = loc.type;
        }
        opts = {
          startkey: [type, loc.part],
          endkey: [type, loc.part, {}],
          group_level: 3
        };
        return db.query("laws/all", opts, function(err, resp) {
          var rows;
          rows = resp.rows.map(function(row) {
            var out;
            out = {};
            out.title = row.key.pop();
            out.part = row.key.pop();
            return out;
          });
          return body.$el.html(body.template.part({
            rowp: rows,
            p: loc.part
          }));
        });
      } else {
        type = 'general';
        opts = {
          startkey: [type],
          endkey: [type, {}],
          group_level: 2
        };
        return db.query("laws/all", opts, function(err, resp) {
          var rows;
          rows = resp.rows.map(function(row) {
            var out;
            out = {};
            out.part = row.key.pop();
            return out;
          });
          return body.$el.html(body.template.general({
            rowg: rows,
            g: true
          }));
        });
      }
    },
    el: $('#mainContent')
  });

  window.body = body;

  Routes = (function(_super) {
    __extends(Routes, _super);

    function Routes() {
      _ref1 = Routes.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Routes.prototype.routes = {
      ':type': 'roo',
      ':type/Part:part': 'roo',
      ':type/Part:part/Title:title': 'roo',
      ':type/Part:part/Title:title/Chapter:chapter': 'roo',
      ':type/Part:part/Title:title/Chapter:chapter/Section:section': 'roo',
      'q/:querry': 'qoo',
      '*spat': 'roo'
    };

    Routes.prototype.roo = function(type, part, title, chapter, section) {
      var parts;
      if (type == null) {
        type = 'home';
      }
      if (part == null) {
        part = 'all';
      }
      if (title == null) {
        title = 'all';
      }
      if (chapter == null) {
        chapter = 'all';
      }
      if (section == null) {
        section = 'all';
      }
      parts = {
        type: type,
        part: part,
        title: title,
        chapter: chapter,
        section: section
      };
      if (parts.chapter !== 'all') {
        parts.chapter = parseInt(parts.chapter, 10);
      }
      if (parts.section !== 'all') {
        parts.section = parseInt(parts.section, 10);
      }
      return body.render(parts);
    };

    return Routes;

  })(Backbone.Router);

  routes = new Routes;

  /*nav = new View
  	render:(location)->
  		true
  	template:"""
  		<ul>
  		{{#items}}
  		
  		{{/items}}
  		</ul>
  	"""
  	el:$ '#navBar'
  */


  start = function(dbname) {
    return db = Pouch("" + location.protocol + "//" + location.host + "/" + dbname, function(err, rslt) {
      Backbone.history.start({
        pushState: true,
        root: "" + dbname + "/_design/laws/_rewrite/",
        hashChange: false
      });
      return window.db = db;
    });
  };

  start('law');

}).call(this);

/*
//@ sourceMappingURL=script.map
*/
