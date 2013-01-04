/*! MyGovBar — 0.0.1 — 2013-01-04 16:31 */
(function(){var e,t,r,n={}.hasOwnProperty,o=function(e,t){function r(){this.constructor=e}for(var o in t)n.call(t,o)&&(e[o]=t[o]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},a=function(e,t){return function(){return e.apply(t,arguments)}};r={interval_id:void 0,last_hash:void 0,cache_bust:1,attached_callback:void 0,window:this,postMessage:function(e,t,r){return t?(r=r||parent,window.postMessage?r.postMessage(e,t.replace(/([^:]+:\/\/[^\/]+).*/,"$1")):t?r.location=t.replace(/#.*$/,"")+"#"+ +new Date+cache_bust++ +"&"+e:void 0):void 0},receiveMessage:function(e,t){var r,n;return window.postMessage?(e&&(r=function(r){return"string"==typeof t&&r.origin!==t||"[object Function]"===Object.prototype.toString.call(t)&&t(r.origin)===!1?(console.log("cross iframe request blocked. Domains "+r.origin+" and "+t+" must match."),!1):e(r)}),window.addEventListener?window[e?"addEventListener":"removeEventListener"]("message",r,!1):window[e?"attachEvent":"detachEvent"]("onmessage",r)):(n&&clearInterval(n),n=null,e?n=setInterval(function(){var t,r,n;return t=document.location.hash,n=/^#?\d+&/,t!==r&&n.test(t)?(r=t,e({data:t.replace(n,"")})):void 0},100):void 0)}},MyGovBar.Models.Comment=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.url=function(){return MyGovBar.config.api_url+"/pages/"+this.get("page_id")+"/comments.json"},t.prototype.defaults=function(){return{page_id:MyGovBar.page.get("id"),body:""}},t}(Backbone.Model),MyGovBar.Collections.Comments=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.model=MyGovBar.Models.Comment,t}(Backbone.Collection),MyGovBar.Models.Page=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.paramRoot="page",t.prototype.urlRoot=MyGovBar.config.api_url+"/pages",t.prototype.url=function(){var e;return e=this.urlRoot,null!=this.id&&(e+="/"+this.id),e+=".json"},t.prototype.lookup=function(){var e;return e=this.url,this.url=this.urlRoot+".json?url="+this.get("url")+"&callback=?",this.fetch(),this.url=e},t.prototype.initialize=function(){return this.set("tags",new MyGovBar.Collections.Tags),this.lookup()},t.prototype.defaults={url:document.referrer,related:[],tag_list:""},t.prototype.parse=function(e){var t;if(null!=e)return t=new MyGovBar.Collections.Tags,_.each(e.tags,function(e){return t.add(new MyGovBar.Models.Tag(e),{silent:!0})}),e.tags=t,e},t}(Backbone.Model),MyGovBar.Collections.PagesCollection=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.model=MyGovBar.Models.Page,t.prototype.url="/pages",t}(Backbone.Collection),MyGovBar.Models.SearchResult=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t}(Backbone.Model),MyGovBar.Collections.SearchResults=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.model=MyGovBar.Models.SearchResult,t.prototype.url=function(){var e;return e="http://search.usa.gov/api/search.json?",e+="&affiliate="+MyGovBar.config.search_affiliate,e+="&query="+this.query,e+="&callback=?"},t.prototype.parse=function(e){var t=this;return _.each(e.results,function(e){var r,n,o,a,i;for(a=["title","content"],i=[],n=0,o=a.length;o>n;n++)r=a[n],i.push(e[r]=t.htmlHighlight(e[r]));return i}),e.results},t.prototype.initialize=function(e){return null!=e.query?this.query=e.query:void 0},t.prototype.htmlHighlight=function(e){return e.replace(/\ue000/g,'<span class="highlight">').replace(/\ue001/g,"</span>")},t}(Backbone.Collection),MyGovBar.Models.Tag=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.url=function(){return MyGovBar.config.api_url+"/tags"+this.get("name")+".json"},t.prototype.defaults={name:"",id:null},t}(Backbone.Model),MyGovBar.Collections.Tags=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.model=MyGovBar.Models.Tag,t.prototype.url=MyGovBar.config.api_url+"/tags",t.prototype.toJSON=function(){return this.pluck("name").join(", ")},t.prototype.initialize=function(){var e=this;return this.on("add remove",function(){return MyGovBar.page.save({tag_list:e.toJSON()})})},t}(Backbone.Collection),MyGovBar.Views.Expanded=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.el="#bar",t.prototype.events={"click #tabs li.tags a":"tags","click #tabs li.search a":"search","click #tabs li.feedback a":"feedback"},t.prototype.render=function(){var e=this;return this.$el.clearQueue(),this.$el.css("width",this.$el.css("width")),setTimeout(function(){return e.$el.animate({width:"100%"},MyGovBar.config.animation_speed,"swing",function(){return e.$el.removeClass("mini"),e.$el.addClass("shown"),e.$el.addClass("expanded"),e.$el.removeClass("hidden"),MyGovBar.CrossDomain.sendHeight(),e.trigger("render")})},1)},t.prototype.tags=function(e){return MyGovBar.router.go("tags",e)},t.prototype.search=function(e){return MyGovBar.router.go("search",e)},t.prototype.feedback=function(e){return MyGovBar.router.go("feedback",e)},t}(Backbone.View),MyGovBar.Views.Feedback=function(e){function t(){return this.submitComment=a(this.submitComment,this),this.saveRating=a(this.saveRating,this),t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.el="#drawer",t.prototype.template=$("#feedback_template").html(),t.prototype.saveOnChange=!1,t.prototype.events={"submit #feedback":"submitComment"},t.prototype.render=function(){var e;return $("#bar").hasClass("expanded")||MyGovBar.router.expand(),e=_.template(this.template),this.$el.html(e()),this.initStars()},t.prototype.saveRating=function(e){return this.saveOnChange?this.model.save({rating:e}):void 0},t.prototype.submitComment=function(e){var t,r;return r=$("#comment"),e.preventDefault(),t=new MyGovBar.Models.Comment({page_id:this.model.get("id")}),t.on("sync",this.commentSuccess),t.save({body:r.val()}),r.val(""),!1},t.prototype.commentSuccess=function(){return $("#comment_submitted").fadeIn().delay(5e3).fadeOut()},t.prototype.initStars=function(){var e;return e=$("input.star"),e.rating({callback:this.saveRating}),e.rating("select",Math.round(parseFloat(this.model.get("avg_rating")))-1),this.saveOnChange=!0},t}(Backbone.View),MyGovBar.Views.Hidden=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.el="#bar",t.prototype.render=function(){var e=this;return $(".row").css("width",window.innerWidth+"px"),this.$el.animate({width:"0px"},MyGovBar.config.animation_speed,"swing",function(){return e.$el.removeClass("shown"),e.$el.addClass("hidden"),e.$el.removeClass("mini"),e.$el.removeClass("expanded"),e.$el.clearQueue(),$(".row").css("width","100%")})},t}(Backbone.View),MyGovBar.Views.Mini=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.el="#bar",t.prototype.events={"click .expand a":"toggle","click #tabs li.related a":"related","click #close-bar":"close"},t.prototype.render=function(){var e=this;return this.$el.clearQueue(),this.$el.addClass("mini"),this.$el.addClass("shown"),this.$el.removeClass("expanded"),this.$el.removeClass("hidden"),$(".row").css("width",window.innerWidth+"px"),setTimeout(function(){return e.$el.animate({width:"100%"},MyGovBar.config.animation_speed,"swing",function(){return $(".row").css("width","100%"),e.related()})},1)},t.prototype.toggle=function(e){return MyGovBar.router.go("expanded",e),this.related()},t.prototype.related=function(e){return MyGovBar.router.go("related",e)},t.prototype.close=function(e){return MyGovBar.router.go("hidden",e)},t}(Backbone.View),MyGovBar.Views.Related=function(e){function t(){return this.render=a(this.render,this),t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.el="#drawer",t.prototype.template=$("#related_template").html(),t.prototype["class"]="related",t.prototype.render=function(){var e;return e=_.template(this.template),this.$el.html(e(this.model.toJSON())),MyGovBar.CrossDomain.sendHeight()},t.prototype.initialize=function(){return this.model.on("change:related",this.render)},t}(Backbone.View),MyGovBar.Views.Search=function(e){function t(){return this.submit=a(this.submit,this),t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.el="#drawer",t.prototype.template=$("#search_template").html(),t.prototype.events={"submit #search":"submit"},t.prototype.render=function(){var e;return e=_.template(this.template),this.$el.html(e())},t.prototype.submit=function(e){return MyGovBar.router.go("search/"+$("#search_query").val(),e)},t}(Backbone.View),MyGovBar.Views.SearchResult=function(e){function t(){return this.render=a(this.render,this),t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.el="#drawer",t.prototype.template=$("#search_result_template").html(),t.prototype.initialize=function(){return this.collection.on("reset",this.render)},t.prototype.render=function(){var e;return $("#bar").hasClass("expanded")||MyGovBar.router.expand(),e=_.template(this.template),this.$el.html(e({query:this.collection.query,results:this.collection.toJSON().splice(0,3)})),MyGovBar.CrossDomain.sendHeight()},t}(Backbone.View),MyGovBar.TagManager=function(){function e(){}return e.prototype.compareItems=function(e,t){return e.get("name")===t.get("name")?!0:!1},e.prototype.init=function(){},e.prototype.filter=function(e,t){return _.filter(e.models,function(e){return this.itemContains(e,t)})},e.prototype.itemContains=function(e){return 0===e.get("name").indexOf(query)},e.prototype.itemToString=function(e){return e.get("name")},e.prototype.stringToItem=function(e){var t;return t=new MyGovBar.Models.Tag,t.set("name",e),t},e}(),MyGovBar.Views.Tags=function(e){function t(){return this.render=a(this.render,this),t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.el="#drawer",t.prototype.template=$("#tags_template").html(),t.prototype.render=function(){var e;return $("#bar").hasClass("expanded")||MyGovBar.router.expand(),e=_.template(this.template),this.$el.html(e({page:this.model.toJSON(),tags:this.model.get("tags").toJSON()})),$("#tag_list").textext({plugins:"tags autocomplete suggestsions ajax",tagsItems:this.model.get("tags").models,itemManager:MyGovBar.TagManager,ajax:{url:MyGovBar.config.api_url+"/tags.json"}}),$("#tag_list").unbind("setSuggestions"),$("#tag_list").on({setSuggestions:function(e,t){var r;return r=[],_.each(t.result,function(e){return r.push(new MyGovBar.Models.Tag(e))}),t.result=r,$("#tag_list").textext()[0].autocomplete().onSetSuggestions(e,t)}}),$("#tag_list").on("setFormData",function(e,t){return MyGovBar.page.get("tags").update(t)})},t}(Backbone.View),e=function(){function e(){this.sendHeight=a(this.sendHeight,this),this.send=a(this.send,this),this.recieve=a(this.recieve,this);var e;e=decodeURIComponent(document.location.hash.replace(/^#/,"")).match(/([^:]+:\/\/.[^/]+)/),null!=e&&(this.parent_url=e[1],r.receiveMessage(this.recieve,this.parent_url),Backbone.history.on("route",this.sendHeight))}return e.prototype.bar=$("#bar"),e.prototype.recieve=function(e){return MyGovBar.router.navigate(e.data,!0)},e.prototype.send=function(e){return r.postMessage(e,this.parent_url)},e.prototype.sendHeight=function(){return this.send("height-"+this.bar.height()+"px")},e}(),MyGovBar.CrossDomain=new e,t=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return o(t,e),t.prototype.routes={hidden:"hide",expanded:"expand",related:"related",tags:"tags",search:"search","search/:query":"searchResult",feedback:"feedback",mini:"mini","*path":"minify"},t.prototype.initialize=function(){return MyGovBar.page=new MyGovBar.Models.Page,Backbone.history.on("route",this.setCurrent),window.onbeforeunload=function(){sessionStorage.myGovBarExpanded="mini"!==Backbone.history.fragment&&"hidden"!==Backbone.history.fragment}},t.prototype.mini=function(){return MyGovBar.CrossDomain.send("mini"),new MyGovBar.Views.Mini({model:MyGovBar.page}).render()},t.prototype.minify=function(){return this.navigate("mini",!0)},t.prototype.expand=function(){return MyGovBar.CrossDomain.send("expanded"),(new MyGovBar.Views.Expanded).render(),this.setCurrent()},t.prototype.hide=function(){return MyGovBar.CrossDomain.send("hidden"),(new MyGovBar.Views.Hidden).render()},t.prototype.tags=function(){return new MyGovBar.Views.Tags({model:MyGovBar.page}).render()},t.prototype.related=function(){return new MyGovBar.Views.Related({model:MyGovBar.page}).render()},t.prototype.search=function(){return(new MyGovBar.Views.Search).render()},t.prototype.searchResult=function(e){var t;return t=new MyGovBar.Collections.SearchResults({query:e}),t.fetch(),new MyGovBar.Views.SearchResult({collection:t})},t.prototype.feedback=function(){return new MyGovBar.Views.Feedback({model:MyGovBar.page}).render()},t.prototype.setCurrent=function(){var e;return e=Backbone.history.fragment,-1!==e.indexOf("search/")&&(e="search search-result"),$("#tabs li.current").removeClass("current"),$("#tabs li."+e).addClass("current"),$("#bar").removeClass(MyGovBar.config.tabs.join(" ")+" search-result"),$("#bar").addClass(e)},t.prototype.go=function(e,t){return null!=t&&t.preventDefault(),this.navigate(e,!0),!1},t}(Backbone.Router),MyGovBar.router=new t,_.each(MyGovBar.config.tabs,function(e){return $("#tabs ."+e).addClass("activated")}),Backbone.history.start(),null!=sessionStorage.myGovBarExpanded&&"true"===sessionStorage.myGovBarExpanded&&MyGovBar.router.navigate("expanded",!0)}).call(this);