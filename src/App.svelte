<script>
	import OverlapView from './OverlapView/OverlapView.svelte'
	import SeparateView from './SeparateView/SeparateView.svelte'
	import FrameView from './FrameView/FrameView.svelte'
	import DistributionView from './DistributionView/DistributionView.svelte'
</script>

<style>
	main {
		display: flex;
		flex-direction: row;
		justify-content: center;
		text-align: left;
		padding: 1em;
		margin: 0 auto;
	}
</style>

<main>
	<OverlapView />
	<SeparateView />
	<FrameView />
	<DistributionView />
</main>