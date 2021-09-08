(this.webpackJsonphereditary=this.webpackJsonphereditary||[]).push([[0],{29:function(e){e.exports=JSON.parse('{"b":"0.5.0","a":"https://github.com/ndrewtl/hereditary"}')},76:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(16),i=n.n(a),s=n(6),o=n(31),j=n(36),u=n(18),b=(n(65),n(13)),l=n(48),h=n(84),d=n(82),O=n(83),f=n(35),x=n(46),p=n.n(x),g=n(52),m=n(53);function y(){return(y=Object(g.a)(p.a.mark((function e(t){var n,r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:return n=e.sent,e.next=5,n.text();case 5:return r=e.sent,e.next=8,Object(m.a)(r);case 8:return e.abrupt("return",e.sent);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var v=n(20),k=n(1);function C(e){var t=e.person,n=e.radius,c=e.reignColors,a=t.name,i=t.country,s=t.reign,o=t.x,j=t.y,u=Object(r.useMemo)((function(){return a.replaceAll(/\s+/g,"_")}),[]);return Object(k.jsxs)("g",{children:[Object(k.jsx)("clipPath",{id:"".concat(u,"-mask"),children:Object(k.jsx)("circle",{r:n,cx:o,cy:j})}),Object(k.jsx)("image",{href:Object(v.join)("/hereditary","flags/".concat(i,".svg")),x:o-2*n,y:j-n,height:2*n,clipPath:"url(#".concat(u,"-mask)")},u),Object(k.jsx)("circle",{r:n,cx:o,cy:j,stroke:s?c[s]:c.none,strokeWidth:"4px",fillOpacity:"0",id:u}),Object(k.jsx)("text",{x:o,y:j-1.2*n,textAnchor:"middle",stroke:"#fff",strokeWidth:"0.5",strokeOpacity:"0.6",fill:"#000",fontSize:"16px",children:a})]})}function S(e){var t=e.link;return Object(k.jsx)("line",{x1:t.source.x,y1:t.source.y,x2:t.target.x,y2:t.target.y,stroke:"#999",strokeOpacity:"0.6",strokeWidth:"10"})}var w=function(e){var t=e.data,n=t.people,c=t.colors,a=e.config,i=a.width,o=a.height,j=a.radius,u=a.countries,x=a.before,p=a.since,g=Object(r.useState)(Object(l.a)().stop()),m=Object(s.a)(g,1)[0],y=Object(r.useState)([]),v=Object(s.a)(y,2),w=v[0],M=v[1],L=Object(r.useState)([]),B=Object(s.a)(L,2),T=B[0],E=B[1],F=Object(r.useState)(null),A=Object(s.a)(F,2),z=A[0],D=A[1];return Object(r.useEffect)((function(){var e=n;x&&(e=e.filter((function(e){return e.born<=x}))),p&&(e=e.filter((function(e){return e.born>=p}))),e=e.filter((function(e){return u.has(e.country)}));var t=Object(f.flatMap)(e,(function(t){var n=[];return t.mother&&e.find((function(e){return e.name==t.mother}))&&n.push({source:t.name,target:t.mother}),t.father&&e.find((function(e){return e.name==t.father}))&&n.push({source:t.name,target:t.father}),n}));m.nodes(e),m.force("charge",Object(h.a)().strength(-2e3)).force("link",Object(d.a)(t).id((function(e){return e.name})).strength(.2)).force("age",function(e){var t,n,r,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.1,a=function(a){t.forEach((function(t){var i=(t.born-n)/(r-n)*e;t.vy+=(i-t.y)*a*c}))};return a.initialize=function(e){t=e,n=Math.min.apply(Math,Object(b.a)(t.map((function(e){return e.born}))))-100,r=Math.max.apply(Math,Object(b.a)(t.map((function(e){return e.born}))))+100},a.strength=function(e){c=e},a}(o,1)).force("horizontal-center",Object(O.a)(i/2).strength(.25)),m.alphaTarget(0).restart(),M(e),E(t)}),[u]),m.on("tick",(function(){M(Object(b.a)(w)),E(Object(b.a)(T))})),Object(k.jsxs)("svg",{width:i,height:o,style:{border:"1px solid black"},viewBox:"0 0 ".concat(i," ").concat(o),onMouseMove:function(e){if(z){var t=Object(s.a)(z,3),n=t[0],r=t[1],c=t[2];c.fx=e.clientX+n,c.fy=e.clientY+r}},onMouseUp:function(){if(z){var e=Object(s.a)(z,3)[2];e.fx=e.fy=null,D(null),m.alphaTarget(0)}},onMouseLeave:function(){if(z){var e=Object(s.a)(z,3)[2];e.fx=e.fy=null,D(null),m.alphaTarget(0)}},children:[Object(k.jsx)("g",{children:T.map((function(e){return Object(k.jsxs)("g",{children:[Object(k.jsx)(S,{link:e}),")"]},"link-".concat(e.source.name,"-").concat(e.target.name))}))}),Object(k.jsx)("g",{children:w.map((function(e){return Object(k.jsx)("g",{onMouseDown:function(t){D([e.x-t.clientX,e.y-t.clientY,e]),m.alphaTarget(.3).restart()},cursor:"move",children:Object(k.jsx)(C,{person:e,radius:j,reignColors:c.reign})},"".concat(e.name,"-node"))}))})]})},M=n(41),L=n(26),B=n(29);function T(){return Object(k.jsx)(M.a,{children:Object(k.jsxs)(j.a,{children:[Object(k.jsxs)(L.a,{children:[Object(k.jsx)(M.a.Brand,{href:"/hereditary",children:"Hereditary"}),Object(k.jsxs)(M.a.Text,{children:["v",B.b]})]}),Object(k.jsxs)(L.a,{children:[Object(k.jsx)(L.a.Link,{href:B.a,children:"GitHub"}),Object(k.jsx)(L.a.Link,{href:Object(v.join)(B.a,"issues/new"),children:"File an Issue"}),Object(k.jsx)(L.a.Link,{href:Object(v.join)(B.a,"edit/main/public/data.yml"),children:"Contribute Data"})]})]})})}var E=n(2),F=n(55),A=n(19),z=n(21),D=n(32);function H(e){var t=e.countryList,n=e.selectedCountries,r=e.setSelectedCountries;return Object(k.jsxs)(u.a,{children:[Object(k.jsx)(A.a.Label,{children:"Countries"}),t.map((function(e){return Object(k.jsx)(A.a.Check,{type:"checkbox",id:"".concat(e,"-enabled"),label:e,checked:n.has(e),onChange:function(){n.has(e)?n.delete(e):n.add(e),r(new Set(n))}},"".concat(e,"-enabled"))}))]})}function I(e){var t=e.before,n=e.since,r=e.setBefore,c=e.setSince;return Object(k.jsxs)(u.a,{children:[Object(k.jsx)(A.a.Label,{children:"Dates"}),Object(k.jsxs)(z.a,{children:[Object(k.jsx)(A.a.Label,{children:"Since"}),Object(k.jsxs)(D.a,{hasValidation:!0,children:[Object(k.jsx)(A.a.Control,{type:"number",value:n,onChange:function(e){return c(e.target.value?Number(e.target.value):void 0)}}),Object(k.jsx)(D.a.Text,{children:"CE"})]})]}),Object(k.jsxs)(z.a,{children:[Object(k.jsx)(A.a.Label,{children:"Before"}),Object(k.jsxs)(D.a,{hasValidation:!0,children:[Object(k.jsx)(A.a.Control,{type:"number",value:t,onChange:function(e){return r(e.target.value?Number(e.target.value):void 0)}}),Object(k.jsx)(D.a.Text,{children:"CE"})]})]})]})}var J=function(e){var t=e.data.people,n=e.config,c=e.submitConfig,a=Object(r.useMemo)((function(){return Object(f.uniq)(t.map((function(e){return e.country}))).sort()}),[t]),i=Object(r.useState)(n.countries),o=Object(s.a)(i,2),j=o[0],b=o[1],l=Object(r.useState)(n.before),h=Object(s.a)(l,2),d=h[0],O=h[1],x=Object(r.useState)(n.since),p=Object(s.a)(x,2),g=p[0],m=p[1];return Object(k.jsx)(k.Fragment,{children:Object(k.jsxs)(u.a,{children:[Object(k.jsx)(z.a,{children:Object(k.jsx)(H,{countryList:a,selectedCountries:j,setSelectedCountries:b})}),Object(k.jsx)(z.a,{children:Object(k.jsx)(I,{before:d,since:g,setBefore:O,setSince:m})}),Object(k.jsx)(F.a,{variant:"primary",type:"submit",onClick:function(){return c(Object(E.a)(Object(E.a)({},n),{},{countries:j,before:d,since:g}))},children:"Apply"})]})})},K=n(39),N=n(59),W={width:800,height:800,radius:30,countries:new Set(["United Kingdom","Spain","German Empire"]),before:1985,since:1800};var G=function(){var e=Object(r.useState)(W),t=Object(s.a)(e,2),n=t[0],c=t[1];return Object(k.jsxs)(N.a,{basename:"/hereditary",children:[Object(k.jsx)(T,{}),Object(k.jsxs)(j.a,{children:[Object(k.jsx)(u.a,{children:Object(k.jsx)("hr",{})}),Object(k.jsxs)(K.a,{promiseFn:function(){return function(e){return y.apply(this,arguments)}(Object(v.join)("/hereditary","data.yml"))},children:[Object(k.jsx)(K.a.Fulfilled,{children:function(e){return Object(k.jsxs)(k.Fragment,{children:[Object(k.jsx)(u.a,{children:Object(k.jsx)(o.a,{style:{marginBottom:"5px"},defaultActiveKey:"0",children:Object(k.jsxs)(o.a.Item,{eventKey:"0",children:[Object(k.jsx)(o.a.Header,{children:"Options"}),Object(k.jsx)(o.a.Body,{children:Object(k.jsx)(J,{data:e,config:n,submitConfig:c})})]})})}),Object(k.jsx)(u.a,{children:Object(k.jsx)(w,{data:e,config:n})})]})}}),Object(k.jsx)(K.a.Loading,{children:"Loading data..."})]})]})]})};i.a.render(Object(k.jsx)(c.a.StrictMode,{children:Object(k.jsx)(G,{})}),document.getElementById("root"))}},[[76,1,2]]]);
//# sourceMappingURL=main.4acf7f35.chunk.js.map