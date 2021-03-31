<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { 
    gen_background_control, 
    gen_frames, 
    gen_sub_frames,
    gen_frame_comparison_plot,
    gen_time_control_view,
    gen_skeleton
  } from './FrameView.js'
  
  // Export let name
  let FrameView = undefined
  let weak_frames = undefined
  let strong_frames = undefined
  let frame_comparison = undefined
  let time_view = undefined

  // Generate frame view
  onMount(async() => {
    gen_weak_frame_view()
    gen_frame_comparison_view()
    gen_strong_frame_view()
    gen_time_view()
    gen_background_control('weak')
    gen_background_control('strong')
    gen_skeleton()
  })

  // Generate weak frame view
  function gen_weak_frame_view() {

    weak_frames = d3.select('#weak-frames')
    gen_frames(weak_frames)

  }

  // Generate frame comparison view
  function gen_frame_comparison_view() {

    // frame_comparison = d3.select('#frame-comparison-view')
    // gen_frame_comparison_plot(frame_comparison)
    gen_frame_comparison_plot()

  }

  // Generate strong frame view
  function gen_strong_frame_view() {

    strong_frames = d3.select('#strong-frames')
    gen_frames(strong_frames)
    
  }

  // Generate time control view
  function gen_time_view() {
    time_view = d3.select('#time-view')
    gen_time_control_view(time_view)
  }

</script>

<style>

   #frame-view {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
  }

  #frame-comparison-view {
    width: 450px;
    height: 207px;
    padding-top: 10px;
  }

  #strong-frame-view {
    padding-top: 12px;
  }

  .background-control-view {
    color: #777777;
  }

  .check-option {
    display: inline-block;
    padding-right: 7px;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  #time-bar {
    margin-top: 50px;
  } 

  /* Hide confidence distribution button */
  #weak-background-control {
    visibility: hidden;
  }
  #strong-background-control {
    visibility: hidden;
  }

  #y-label-dropdown-wrapper {
    display: flex;
    transform: translate(170px, -310px);
  }

  #y-label-skel-deltas {
    padding-right: 5px;
    font-size: 0.9rem;
  }

  #time-view {
    margin-top: -76px;
  }
</style>

<div id='frame-view' class='pose-view' bind:this={FrameView}>

  <!-- Weak frame -->
  <div id='weak-frame-view'>

    <!-- Frame background control -->
    <div id='weak-background-control' class='background-control-view'>
      <div id='weak-background-frame' class='check-option'></div>
      <div id='weak-background-confidence' class='check-option'></div>
    </div>

    <!-- Frames -->
    <div id='weak-frames' class='frames'></div>
    <div id='weak-detailed-frames' class='detailed-frames'></div>

  </div>
    <!-- Frame comparison -->
    <div id='frame-comparison-view'>
    </div>

  <!-- Strong frame -->
  <div id='strong-frame-view'>

    <!-- Frames -->
    <div id='strong-detailed-frames' class='detailed-frames'></div>
    <div id='strong-frames' class='frames'></div>

    <!-- Frame control -->
    <div id='strong-background-control' class='background-control-view'>
      <div id='strong-background-frame' class='check-option'></div>
      <div id='strong-background-perturbation' class='check-option'></div>
      <div id='strong-background-confidence' class='check-option'></div>
    </div>

  </div>

     <!-- Y-label dropdown -->
     <div id="y-label-dropdown-wrapper">
      <div id="y-label-skel-deltas">Skeleton deltas: </div>
      <div id='y-label-dropdown'></div>
    </div>

  <!-- Time control view -->
  <div id='time-view'>
    <div id='time-bar'></div>
    <div id='time-button'></div>
  </div>
    
</div> 

