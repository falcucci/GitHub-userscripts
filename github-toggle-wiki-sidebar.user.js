// ==UserScript==
// @name        GitHub Toggle Wiki Sidebar
// @version     1.0.13
// @description A userscript that adds a button to toggle the GitHub Wiki sidebar
// @license     MIT
// @author      Rob Garrison
// @namespace   https://github.com/Mottie
// @include     https://github.com/*
// @run-at      document-idle
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://greasyfork.org/scripts/28721-mutations/code/mutations.js?version=597950
// @icon        https://assets-cdn.github.com/pinned-octocat.svg
// @updateURL   https://raw.githubusercontent.com/Mottie/GitHub-userscripts/master/github-toggle-wiki-sidebar.user.js
// @downloadURL https://raw.githubusercontent.com/Mottie/GitHub-userscripts/master/github-toggle-wiki-sidebar.user.js
// ==/UserScript==
(() => {
	"use strict";

	// disable click targeting of button SVG internals
	GM_addStyle(".ghtws-button > * { pointer-events: none; }");

	// sidebar state
	let isHidden = false,

		toggleIcon = "<svg class='octicon' xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill='none' stroke='currentColor' stroke-miterlimit='10' d='M.5 3.5h10v9H.5z'/><path fill='currentColor' stroke='currentColor' stroke-miterlimit='10' d='M7 7.8l1.5-1.2V9zM10.5 3.5h5v9h-5v-9zm4.3 4.3l-4.3-3V11l4.3-3.2z'/></svg>";

	function addToggle() {
		if (document.querySelector("#wiki-wrapper") && !document.querySelector(".ghtws-button")) {
			let el = document.querySelector(".gh-header-actions") || document.querySelector(".gh-header-title");
			const button = document.createElement("div");
			button.className = "btn btn-sm tooltipped tooltipped-s ghtws-button";
			button.innerHTML = toggleIcon;
			button.setAttribute("aria-label", "Toggle Sidebar");
			if (el.nodeName === "H1") {
				// non-editable wiki pages
				button.style.float = "right";
				el = el.parentNode;
			}
			// editable wikis have a "header-actions" area
			// prepend button
			el.insertBefore(button, el.childNodes[0]);
			if (isHidden) {
				toggleSidebar();
			}
		}
	}

	function toggleSidebar() {
		const sidebar = document.querySelector("#wiki-rightbar"),
			wrapper = sidebar && sidebar.parentNode;
		if (sidebar) {
			if (isHidden) {
				sidebar.style.display = "none";
				wrapper.classList.remove("has-rightbar");
			} else {
				sidebar.style.display = "";
				wrapper.classList.add("has-rightbar");
			}
			GM_setValue("sidebar-state", isHidden);
		}
	}

	function toggleEvent(event) {
		const target = event.target;
		if (target && target.classList.contains("ghtws-button")) {
			isHidden = !isHidden;
			toggleSidebar();
		}
	}

	function init() {
		isHidden = GM_getValue("sidebar-state", false);
		document.querySelector("body").addEventListener("click", toggleEvent);
		addToggle();
	}

	document.addEventListener("ghmo:container", addToggle);
	init();
})();
