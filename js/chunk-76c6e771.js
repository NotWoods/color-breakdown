function e(e){return new Promise((t,n)=>{let o=!1;document.addEventListener("copy",t=>{t.clipboardData.setData("text/plain",e),t.preventDefault(),o=!0},{once:!0}),document.execCommand("copy"),o?t():n()})}export{e as writeText};
//# sourceMappingURL=chunk-76c6e771.js.map
