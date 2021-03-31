<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { 
    gen_separate_header, 
    gen_background, 
    gen_frame_range_selection,
    gen_combined_slider
  } from './SeparateView.js'
  
  // Export let name
  let SeparateView = undefined
  let weak_header = undefined
  let weak_background = undefined
  let strong_header = undefined
  let strong_background = undefined
  let attack_slider = undefined

  // Generate separate view
  onMount(async() => {
    gen_weak_view()
    attack_slider = document.getElementById('epsilon-slider')
    gen_combined_slider(attack_slider)
    gen_strong_view()
    gen_frame_range_selection()
  })

  // Generate weak attack view
  function gen_weak_view() {

    // Weak attack view components
    weak_header = document.getElementById('weak-view-header')
    weak_background = d3.select('#weak-view-bg')

    // Generate header 
    gen_separate_header('weak', weak_header)

    // Add background video
    gen_background(weak_background, 'weak')

  }

  // Generate attacked view
  function gen_strong_view() {

    // Strong attack view components
    strong_header = document.getElementById('weak-view-header')
    strong_background = d3.select('#strong-view-bg')

    // Generate header 
    gen_separate_header('strong', strong_header)

    // Add background video
    gen_background(strong_background, 'strong')

  }

</script>

<style>

  #separate-view {
    text-align: left;
    margin: 10px;
    display: inline-block;
    flex-direction: column;
    margin-top: -10px;
  }

  .separate-view-header {
    display: flex;
    padding-top: 5px;
    padding-bottom: 1px;
    padding-right: 10px;
    border-radius: 5px;
    width: max-content;
  }

  .separate-view-main {
    transform: translate(0px, -5px);
  }

  .skeleton-range-selection-option-component {
    display: inline-block;
  }

  .skeleton-range-selection-text {
    font-size: 14px;
    transform: translate(0px, -1px);
  }

  #epsilon-slider-wrapper {
    padding-bottom: 1rem;
  }

  #weak-view-header {
    font-size: 1rem;
    margin-bottom: -4px;
  }

  #strong-view-header {
    font-size: 1rem;
    padding-top: 0px;
    margin-bottom: -4px;
  }

  #skeleton-one-frame {
    display: none;
  }

  #strong-view-main {
    margin-bottom: -10px;
  }

</style>


<div id='separate-view' class='pose-view' bind:this={SeparateView}>

  <!-- Weak attack view -->
  <div id='weak-view'>
    <div id='weak-view-header' class="separate-view-header">
      <div id='weak-view-header-title' class="separate-view-header-title">
        <div id='weak-title-0'></div>
        <div id='weak-title-1'></div>
      </div>
      <div id='weak-strength'></div>
    </div>
    <div id='weak-predicted-wrapper' class="separate-view-prediction-wrapper">
      <div id='weak-predicted' class="separate-view-prediction"></div>
      <div id='weak-predicted-value' class="separate-view-prediction-value"></div>
    </div>
    <div id='weak-view-main' class="separate-view-main">
      <svg id='weak-view-svg'>
        <g id='weak-view-bg'></g>
        <g id='weak-view-skeleton'></g>
      </svg>
    </div>
  </div>

  <div id="epsilon-slider-wrapper">
    <div id="epsilon-slider">
    </div>
    <div id="stronger-text">
    </div>
  </div>

  <!-- Strong attack view -->
  <div id='strong-view'>
    <div id='strong-view-main' class="separate-view-main">
      <svg id='strong-view-svg'>
        <g id='strong-view-bg'></g>
        <g id='strong-view-skeleton'></g>
      </svg>
    </div>
    <div id='strong-view-header' class="separate-view-header">
      <div id='strong-view-header-title' class="separate-view-header-title">
        <div id='strong-title-0'></div>
        <div id='strong-title-1'></div>
      </div>
      <div id='strong-strength'></div>
    </div>
    <div id='strong-predicted-wrapper' class="separate-view-prediction-wrapper">
      <div id='strong-predicted' class="separate-view-prediction"></div>
      <div id='strong-predicted-value' class="separate-view-prediction-value"></div>
    </div>
  </div>

  <!-- Frame range selection view -->
  <div id='frame-range-selection-view'>
    <div id='skeleton-one-frame' class='skeleton-range-selection-option'>
      <div id='skeleton-one-frame-icon' class='skeleton-range-selection-option-component'></div>
      <div id='skeleton-one-frame-text' class='skeleton-range-selection-option-component skeleton-range-selection-text'></div>
    </div>
    <div id='skeleton-frame-range' class='skeleton-range-selection-option'>
      <div id='skeleton-frame-range-icon' class='skeleton-range-selection-option-component'></div>
      <div id='skeleton-frame-range-text' class='skeleton-range-selection-option-component skeleton-range-selection-text'></div>
    </div>
  </div>

</div> 

