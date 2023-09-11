import {template, html, unsanitized, read_file} from "@benev/turtle"

const importmap = await read_file("x/importmap.json")

export default template(async({path}) => html`
<!doctype html>
	<html>
		<head>
			<meta charset="utf-8"/>
			<meta name="viewport" content="width=device-width,initial-scale=1"/>
			<meta name="darkreader" content="dark"/>
			<title>Midnight Grillin'</title>
			<script type="importmap">${unsanitized(importmap)}</script>
			<script type="module" src="${path(import.meta.url).version.root('/demo.js')}"></script>
			<link
				rel="stylesheet"
				href="${path(import.meta.url).version.root('style.css.js')}"
				/>
		</head>
		<body>
			<div style="width: 3px; height: 3px; background: lime; z-index: 10; left: 50%; top: 50%; position: absolute;" class=crosshair></div>
			<benev-theater view-mode="cinema"></benev-theater>
			<testing-tools></testing-tools>
		</body>
	</html>
	
`)
