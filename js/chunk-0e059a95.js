function writeText(e){return new Promise((t,n)=>{let o=!1;const r=t=>{t.clipboardData.setData("text/plain",e),t.preventDefault(),o=!0};document.addEventListener("copy",r),document.execCommand("copy"),document.removeEventListener("copy",r),o?t():n()})}export{writeText};
//# sourceMappingURL=chunk-0e059a95.js.map
