<template>
	<div id="root">
		<md-toolbar class="md-whiteframe md-whiteframe-1dp">
			<h2 class="md-title" style="flex: 1">WebSockets GameOfLife</h2>
			<md-button
				@click="openDialog('Join')"
				v-if="!userName"
			>
				Join
			</md-button>
		</md-toolbar>

		<div id="canvas"></div>
		<div id="score" v-if='players.length > 0'>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>Player</th>
						<th>Population</th>
					</tr>
				</thead>
				<tbody>
					<tr :style='{ color: player.color }' v-for='player in players'>
						<td><md-icon>face</md-icon></td>
						<td>{{ player.token }}</td>
						<td>{{ player.population }}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<md-dialog-prompt
				:md-title="prompt.title"
				:md-ok-text="prompt.ok"
				:md-cancel-text="prompt.cancel"
				:md-input-maxlength="prompt.maxlength"
				:md-input-placeholder="prompt.placeholder"
				@close="onClose"
				v-model="prompt.value"
				ref="Join">
		</md-dialog-prompt>
	</div>
</template>

<script>
	export default {
		data: () => ({
			userName: '',
			players: [],
			prompt: {
				title: 'What\'s your name?',
				ok: 'Done',
				cancel: 'Cancel',
				id: 'name',
				name: 'name',
				placeholder: 'Type your name...',
				maxlength: 30,
				value: ''
			}
		}),
		methods: {
			openDialog(ref) {
				this.$refs[ref].open();
			},
			closeDialog(ref) {
				this.$refs[ref].close();
			},
			onClose() {
				this.userName = this.prompt.value;
				this.$emit('set_user_name', this.userName);
			}
		}
	}
</script>

<style>
	#canvas, #score {
		display: inline-block;
		padding: 20px;
		vertical-align: top;
	}

	#canvas > canvas {
		margin: 20px auto 0;
		box-sizing: border-box;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}
</style>
