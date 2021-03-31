<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { 
    gen_overlap_header, 
    gen_background, 
    gen_class_info 
  } from './OverlapView.js'

  // Export let name
  let overlapView = undefined
  let overlap_header = undefined
  let overlap_background = undefined
  let overlap_class_info = undefined

  // Draw overlap view
  onMount(async() => {

    // Overlap view components
    overlap_header = document.getElementById('overlap-view-header')
    overlap_background = d3.select(overlapView).select('#overlap-view-bg')
    overlap_class_info = document.getElementById('overlap-view-classInfo')

    // Generate header
    gen_overlap_header(overlap_header)

    // Add background video
    gen_background(overlap_background)

    // Add class info
    gen_class_info(overlap_class_info)

  })
  
</script>

<style>

  #overlap-view {
    margin: 10px;
    margin-top: 4px;
    display: inline-block;
  }

  #overlap-view-header {
    display: flex;
    padding-top: 5px;
    padding-bottom: 10px;
    padding-right: 10px;
    border-radius: 5px;
    width: max-content;
    font-size: 1.15rem;
  }

  #overlap-view-main {
    transform: translate(0px, -5px);
  }

  #overlap-view-classInfo {
    justify-content: center;
    display: flex;
  }

  .classInfo {
    padding: 5px;
    padding-top: 20px;
    justify-content: left;
  }

  #overlap-frame-number-text {
    margin-top: -10px;
  }

</style>

<div id='overlap-view' class='pose-view' bind:this={overlapView}>
  <div id='overlap-view-header'></div>
  <div id='overlap-view-main'>
    <svg id='overlap-view-svg'>
      <g id='overlap-view-bg'></g>
      <g id='overlap-view-skeleton'></g>
    </svg>
  </div>
  <div id='overlap-frame-number-text'>
    Frame: 0
  </div>
  <div id='overlap-view-classInfo'>
    <div id='weak-classInfo' class='classInfo'></div>
    <div id='strong-classInfo' class='classInfo'></div>
  </div>
  <div id='overlap-view-choose-wrapper'>
  </div>
</div> 

