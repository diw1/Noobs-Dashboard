(this.webpackJsonpveryrich=this.webpackJsonpveryrich||[]).push([[0],{234:function(t,e,n){t.exports=n(425)},236:function(t,e,n){},425:function(t,e,n){"use strict";n.r(e);var r=n(0),a=n.n(r),o=(n(236),n(198)),s=n(199),i=n(226),c=n(229),u=n(429),l=n(430),d=n(42),p=n(428),g=n(26),f=n.n(g),m="c4c4e61c72c1734522a811abe6659ec5",h="https://classic.warcraftlogs.com/v1/",v=216e5,b=[15252,15249,15250,15246,15247,15725,15334,15728,15984,15726,15233,15230,15240,15235,15236,15667,15630,15802,15264,15311,15277,15262,15312],D=[15725,15334,15728,15726,15802,15984,15667],S=function(t){Object(c.a)(n,t);var e=Object(i.a)(n);function n(t){var r;return Object(o.a)(this,n),(r=e.call(this,t)).submit=function(){var t=[];r.setState({loading:!0}),t.push(g.actions.report.getBOSSDmg(r.state.report)),t.push(g.actions.report.getFight(r.state.report)),Promise.all(t).then((function(){var t=r.findTargetIds(b,r.props.fight),e=r.findTargetIds(D,r.props.fight);g.actions.report.getBossTrashDmg({trashIds:t,reportId:r.state.report}).then((function(){return r.setState({loading:!1})})),g.actions.report.getExtraBossDmg({bossTrashIds:e,reportId:r.state.report}).then((function(){return r.setState({loading:!1})}))}))},r.findTargetIds=function(t,e){return(null===e||void 0===e?void 0:e.enemies).map((function(e){return t.includes(e.guid)&&e.id})).filter((function(t){return!!t}))},r.calculateBossTime=function(t){var e=0;return t&&t.fights.filter((function(t){return 0!==t.boss})).map((function(t){e+=t.end_time-t.start_time})),e/1e3},r.generateSource=function(t,e){var n={},a={},o=r.calculateBossTime(r.props.fight),s=t.map((function(t){var r,s=null===e||void 0===e||null===(r=e.find((function(e){return e.id===t.id})))||void 0===r?void 0:r.total;return n[t.type]=n[t.type]>t.total?n[t.type]:t.total,a[t.type]=a[t.type]>s?a[t.type]:s,{id:t.id,name:t.name,type:t.type,bossDmg:t.total,bossDps:(t.total/o).toFixed(2),bossTrashDmg:s}}));return s=s.map((function(t){var e=(t.bossDmg/n[t.type]).toFixed(2),r=(t.bossTrashDmg/a[t.type]).toFixed(2);return t.bossScore=e,t.bossTrashScore=r,t.finalScore=((parseFloat(e)+parseFloat(r))/2).toFixed(2),t}))},r.state={report:null,loading:!1},r}return Object(s.a)(n,[{key:"render",value:function(){var t=this,e=this.props,n=e.bossDmg,r=e.bossTrashDmg,o=n&&r&&this.generateSource(n,r);return a.a.createElement(u.a,{title:a.a.createElement("div",null,a.a.createElement(l.a,{style:{width:400},placeholder:"\u8bf7\u7c98\u8d34reportID\uff0c\u4f8b\u5982: Jzx9tgnTKvVwAX",onChange:function(e){return t.setState({report:e.target.value})}}),a.a.createElement(d.a,{onClick:this.submit},"\u63d0\u4ea4"))},a.a.createElement(p.a,{size:"small",loading:this.state.loading,dataSource:o,columns:[{title:"ID",dataIndex:"name"},{title:"\u804c\u4e1a",dataIndex:"type",filters:[{text:"\u6218",value:"Warrior"},{text:"\u6cd5",value:"Mage"},{text:"\u672f",value:"Warlock"},{text:"\u730e",value:"Hunter"},{text:"\u8d3c",value:"Rogue"},{text:"\u5fb7",value:"Druid"},{text:"\u7267",value:"Priest"},{text:"\u9a91",value:"Paladin"},{text:"\u8428",value:"Shaman"}],onFilter:function(t,e){return e.type===t}},{title:"Boss\u4f24\u5bb3",dataIndex:"bossDmg",sorter:function(t,e){return t.bossDmg-e.bossDmg}},{title:"Boss DPS",dataIndex:"bossDps"},{title:"\u5168\u7a0b\u6709\u6548\u4f24\u5bb3",dataIndex:"bossTrashDmg",sorter:function(t,e){return t.bossTrashDmg-e.bossTrashDmg},defaultSortOrder:"descend"},{title:"BOSS\u5206",dataIndex:"bossScore"},{title:"\u5168\u7a0b\u5206",dataIndex:"bossTrashScore"},{title:"\u5e73\u5747\u5206",dataIndex:"finalScore",sorter:function(t,e){return t.finalScore-e.finalScore}}],rowKey:"id",pagination:!1}))}}]),n}(r.Component),x=Object(g.connect)((function(t){return{bossDmg:t.report.bossDmg,fight:t.report.fight,bossTrashDmg:t.report.bossTrashDmg}}),null)(S);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var T=n(38),w=n.n(T),I=n(81),y=n(230),O=n(223),B=n.n(O);function k(t,e,n,r){return B()({method:t,url:e,headers:n,data:r})}function j(t){return k("GET",t,null,null)}var E={getDMGdone:function(t){return j("".concat(h,"report/tables/damage-done/").concat(t,"?api_key=").concat(m,"&end=").concat(v))},getBOSSDMG:function(t){return j("".concat(h,"report/tables/damage-done/").concat(t,"?api_key=").concat(m,"&end=").concat(v,"&targetclass=boss"))},getBOSSTrashDmg:function(t,e){return j("".concat(h,"report/tables/damage-done/").concat(t,"?api_key=").concat(m,"&end=").concat(v,"&targetid=").concat(e))},getFight:function(t){return j("".concat(h,"report/fights/").concat(t,"?api_key=").concat(m))}},F=n(155),P=n.n(F),_={name:"report",initialState:{dmg:null,bossDmg:null,fight:null,bossTrashDmg:null},reducers:{save:function(t,e){return Object(y.a)({},t,{},e)}},effects:{getS:function(t,e){return e()},getDmg:function(t){return Object(I.a)(w.a.mark((function e(){var n;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.getDMGdone(t);case 2:n=e.sent,g.actions.report.save({dmg:n.data.entries});case 4:case"end":return e.stop()}}),e)})))()},getBossTrashDmg:function(t){return Object(I.a)(w.a.mark((function e(){var n,r,a,o;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=t.reportId,r=t.trashIds,a=g.actions.report.getS().report.bossDmg,o=[],r.map((function(t){o.push(E.getBOSSTrashDmg(n,t))})),Promise.all(o).then((function(t){t.map((function(t){a=a.map((function(e){var n,r=P.a.cloneDeep(e),a=null===(n=t.data.entries.find((function(t){return t.id===e.id})))||void 0===n?void 0:n.total;return r.total=Number.isInteger(a)?r.total+a:r.total,r})),g.actions.report.save({bossTrashDmg:a})}))}));case 5:case"end":return e.stop()}}),e)})))()},getExtraBossDmg:function(t){return Object(I.a)(w.a.mark((function e(){var n,r,a,o;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=t.reportId,r=t.bossTrashIds,a=g.actions.report.getS().report.bossDmg,o=[],r.map((function(t){o.push(E.getBOSSTrashDmg(n,t))})),Promise.all(o).then((function(t){t.map((function(t){a=a.map((function(e){var n,r=P.a.cloneDeep(e),a=null===(n=t.data.entries.find((function(t){return t.id===e.id})))||void 0===n?void 0:n.total;return r.total=Number.isInteger(a)?r.total+a:r.total,r})),g.actions.report.save({bossDmg:a})}))}));case 5:case"end":return e.stop()}}),e)})))()},getBOSSDmg:function(t){return Object(I.a)(w.a.mark((function e(){var n;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.getBOSSDMG(t);case 2:n=e.sent,g.actions.report.save({bossDmg:n.data.entries});case 4:case"end":return e.stop()}}),e)})))()},getFight:function(t){return Object(I.a)(w.a.mark((function e(){var n;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.getFight(t);case 2:n=e.sent,g.actions.report.save({fight:n.data});case 4:case"end":return e.stop()}}),e)})))()}}},G=n(224),M=n.n(G);f.a.model(_),f.a.defaults({middlewares:[M.a]}),Object(g.render)(a.a.createElement(g.Router,null,a.a.createElement(g.Switch,null,a.a.createElement(g.Route,{path:"/",component:x}))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[234,1,2]]]);
//# sourceMappingURL=main.362f53b2.chunk.js.map