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
		</head>
		<body>
			<benev-theater view-mode="cinema"></benev-theater>
		</body>
	</html>
	
`)
