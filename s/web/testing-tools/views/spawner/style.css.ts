import {css} from "lit"

export const styles =  css`
	.icon {
		cursor: pointer;
	}

	.items {
		background: white;
		font-family: sans-serif;
		border-radius: 5px;
		padding: 0.4em;
		font-weight: bold;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 0.3em;
		justify-content: space-between;
		& svg:hover {
			color: green;
			cursor: pointer;
		}
	}

	.svg {
		display: flex;
	}

	p {
		color: blue;
		font-size: 1em;
		margin: 0.4em 0;
		text-align: center;
	}
`
