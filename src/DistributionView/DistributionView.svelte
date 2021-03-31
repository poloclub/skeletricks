
<script context="module">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { create, all } from 'mathjs'
  import { 
    jsdivergence, 
    epsToString,
    layout, 
    get_dist_data, 
    get_val_data, 
    get_file_name, 
    get_val_file_name} from './DistributionView'
  import {
    week_mad, 
    set_week_mad,
    week_med, 
    set_week_med} from '../utils/variable'

  // Export let name
  let DistributionView = undefined

  let curr_clip = ""
  let curr_joint = ""
  let curr_weak_eps = 0
  let curr_strong_eps = 0
  let curr_var_type = ""
  let curr_bin_size = 20
  let curr_attack_type = "patch"
  let hoverStrongly = 0
  let hoverWeakly = 0
  let js_divergence = 0

  const config = { }
  const math = create(all, config)

  /**
   * Updates the distribution plot and JS-divergence value
   * @param {string} clip The name of the clip (item-00000, ..., item-item-00100).
   * @param {string} joint The name of the joint (left_shoulder, right_shoulder, 
   *        left_elbow, right_elbow, left_hip, right_hip, left_knee, right_knee)
   * @param {number} weak_eps The epsilon value of the weakly attacked video.
   * @param {number} strong_eps The epsilon value of the strongly attacked video.
   * @param {string} var_type The type of the variable we are presenting (angle, displacement-average)
   * * @param {string} attack_type The type of the variable we are presenting (pgd, patch)
   */
  export async function update_dist_plot(clip = curr_clip, 
                                         joint = curr_joint, 
                                         weak_eps = curr_weak_eps, 
                                         strong_eps = curr_strong_eps, 
                                         var_type = curr_var_type, 
                                         attack_type = curr_attack_type) {
    clip != null ? curr_clip = clip: clip = curr_clip
    joint != null ? curr_joint = joint: joint = curr_joint
    weak_eps != null ? curr_weak_eps = weak_eps: weak_eps = curr_weak_eps
    strong_eps != null ? curr_strong_eps = strong_eps: strong_eps = curr_strong_eps
    var_type != null ? curr_var_type = var_type: var_type = curr_var_type
    attack_type != null ? curr_attack_type = attack_type: attack_type = curr_attack_type

    let data_dir = ""
    if (attack_type == "pgd" || attack_type == "PGD") {
      data_dir = "pgd_interpolated_data/" + clip + "/"
    } else if (attack_type == "patch" || attack_type == "Patch") {
      data_dir = "patch_interpolated_data/" + clip + "/"
    }
    let weak_val_file_name = get_val_file_name(weak_eps, var_type, attack_type)
    let strong_val_file_name = get_val_file_name(strong_eps, var_type, attack_type)

    let weak_val_file_path = data_dir+weak_val_file_name
    let strong_val_file_path = data_dir+strong_val_file_name

    let curr_strong_x_val = await get_val_data(strong_val_file_path, joint)
    let curr_weak_x_val = await get_val_data(weak_val_file_path, joint)

    let both_max = Math.max(Math.max.apply(Math, curr_strong_x_val), Math.max.apply(Math, curr_weak_x_val))
    let both_min = Math.min(Math.min.apply(Math, curr_strong_x_val), Math.min.apply(Math, curr_weak_x_val))

    let strong_att = {
      type: 'histogram',
      y: curr_strong_x_val,
      name: 'Stronger',
      marker: {
        color: 'rgb(233, 146, 58)',
        opacity: 0.5
      },
      ybins: {
        start: both_min,
        end: both_max,
        size: (both_max - both_min)/curr_bin_size, 
      },
      hoverinfo: 'none'
    }

    let weak_att = {
      type: 'histogram',
      y: curr_weak_x_val,
      name: 'Weaker',
      marker: {
        color: 'rgb(163, 106, 244)',
        opacity: 0.5
      },
      ybins: {
        start: both_min,
        end: both_max,
        size: (both_max - both_min)/curr_bin_size, 
      },
      hoverinfo: 'none'
    }
    
    let distData = [strong_att, weak_att]
    let plot = Plotly.newPlot("plotDiv", distData, layout, {showSendToCloud:true, displayModeBar: false})

    
    plot.then((result) => {
      let hist_data = result.calcdata
      let strong_hist_data = hist_data[0]
      let week_hist_data = hist_data[1]
      let strong_bin_dict = {}
      let week_bin_dict = {}
      strong_hist_data.forEach((e) => {
        strong_bin_dict[e.p] = e.s
      })
      week_hist_data.forEach((e) => {
        week_bin_dict[e.p] = e.s
      })
      let week_bin_sizes = []
      let strong_bin_sizes = []
      if (strong_hist_data.length > week_hist_data.length) {
        Object.keys(strong_bin_dict).forEach(function(key) {
          if (key in week_bin_dict) {
            week_bin_sizes.push(week_bin_dict[key])
            strong_bin_sizes.push(strong_bin_dict[key])
          } else {
            week_bin_sizes.push(0)
            strong_bin_sizes.push(strong_bin_dict[key])
          }
        });
      } else {
        Object.keys(week_bin_dict).forEach(function(key) {
          if (key in strong_bin_dict) {
            week_bin_sizes.push(week_bin_dict[key])
            strong_bin_sizes.push(strong_bin_dict[key])
          } else {
            week_bin_sizes.push(week_bin_dict[key])
            strong_bin_sizes.push(0)
          }
        });
      }
      var js_val = document.getElementById("js-divergence-val");
      js_val.innerHTML = jsdivergence(strong_bin_sizes, week_bin_sizes);
    })
    let plotDiv= document.getElementById('plotDiv')
    let currStrongly = document.getElementById('curr-strongly-value')
    let currweakly = document.getElementById('curr-weakly-value')
    
    plotDiv.on('plotly_hover', function(data){
      if (typeof data.points[0] !== 'undefined') {
        hoverStrongly = data.points[0].x
        currStrongly.innerHTML = hoverStrongly
      }
      if (typeof data.points[1] !== 'undefined') {
        hoverWeakly = data.points[1].x
        currweakly.innerHTML = hoverWeakly
      }
      if (data.points[1] != null){
        let week_new_opacity = Array.from({length: curr_bin_size}, (v, k) => 0.5); 
        week_new_opacity[data.points[1].binNumber] = 0.8
        let week_update = {'marker':{color: 'rgb(163, 106, 244)', opacity: week_new_opacity}}; 
        Plotly.restyle('plotDiv', week_update, 1);
      }
      let strong_new_opacity = Array.from({length: curr_bin_size}, (v, k) => 0.5); 
      strong_new_opacity[data.points[0].binNumber] = 0.8
      var strong_update = {'marker':{color: 'rgb(233, 146, 58)', opacity: strong_new_opacity}}; 
      Plotly.restyle('plotDiv', strong_update, 0);
    })
    
    plotDiv.on('plotly_unhover', function(data) {
      let currStrongly = document.getElementById('curr-strongly-value')
      let currweakly = document.getElementById('curr-weakly-value')
      hoverStrongly = 0
      hoverWeakly = 0
      currStrongly.innerHTML = hoverStrongly
      currweakly.innerHTML = hoverWeakly
      
      var strong_update = {'marker':{color: 'rgb(233, 146, 58)', opacity: 0.5}}; 
      var week_update = {'marker':{color: 'rgb(163, 106, 244)', opacity: 0.5}}; 
      Plotly.restyle('plotDiv', strong_update, 0);
      Plotly.restyle('plotDiv', week_update, 1);
    })
  }
</script>
<script>
  import noUiSlider from 'nouislider';
  import { 
  attack_strength,
  data_dir,
  y_line_chart
} from '../utils/variable.js'

  function create_slider(tar_div, start, end, step, default_val, onSetAction) {
    noUiSlider.create(tar_div, {
        start: default_val,
        range: {
            'min': start,
            'max': end
        },
        step: step
    });
    tar_div.noUiSlider.on('slide', () => onSetAction())
  }
    
  onMount(async() => {
    let script_plotly = document.createElement('script');
    script_plotly.src = "https://cdn.plot.ly/plotly-latest.min.js"
    document.head.append(script_plotly);

    script_plotly.onload = function() {
      update_dist_plot(data_dir, y_line_chart['selected'], 
                     attack_strength['weak'], attack_strength['strong'],
                     'displacement-average')
   };
    let slider_body = document.getElementById('slider-body')

    function update_slider(value) {
      curr_bin_size = parseInt(slider_body.noUiSlider.get())
      let bin_size = document.getElementById('curr-bin-size-value')
      bin_size.innerHTML = curr_bin_size
      update_dist_plot(curr_clip, curr_joint, curr_weak_eps, curr_strong_eps, curr_var_type)
    }

    create_slider(slider_body, 5, 50, 5, 20, update_slider)
  })
</script>

<style>

  /* TODO: Add css style here */

  #distribution-view {
    /* TODO: Set style of distribution view */
    height: 550px;
    width: 334px;
    margin-top: 24px;
  }

  .side-by-side{
    display: flex;
  }

  .strong-text-color{
    font-size: 10px;
    color:rgb(233, 146, 58)
  }

  .weak-text-color{
    font-size: 10px;
    color:rgb(163, 106, 244)
  }
  
  #hover-info{
    margin-top: 100px;
    margin-left: 10px;
  }

  .text-margin{
    margin-left: 5px;
  }

  #curr-bin-size{
    font-size: 10px;
  }

  #js-divergence{
    font-size: 10px;
  }

  #slider {
    margin-left: 0px;
    margin-top: 5px;
    width: 117px;
    margin-bottom: 5px;
  }

  #js-divergence-val {
    margin-left: 2px;
  }

  #curr-bin-size-value {
    margin-left: 2px;
  }

  #info {
    padding-top: 10px;
  }


</style>

<div id='distribution-view' bind:this={DistributionView}>
  <div id="hover-info" class="side-by-side">
    <div id="curr-strongly" class="side-by-side">
      <div id="curr-strongly-label" class="strong-text-color">Stronger: </div>
      <div id="curr-strongly-value" class="strong-text-color">{hoverStrongly}</div>
    </div>
    <div id="curr-weakly" class="side-by-side text-margin">
      <div id="curr-weakly-label" class="weak-text-color">Benign: </div>
      <div id="curr-weakly-value" class="weak-text-color">{hoverWeakly}</div>
    </div>
  </div>
  <div id="plotDiv"><!-- Plotly chart will be drawn inside this DIV --></div>
  <div id="slider">
    <div id="slider-body">
    </div>
  </div>
  <div id="info">
    <div id="curr-bin-size" class="side-by-side">
      <div id="curr-bin-size-label">Bin Count: </div>
      <div id="curr-bin-size-value">{curr_bin_size}</div>
    </div>
    <div id="js-divergence" class="side-by-side center">
      <div id="js-divergence-label" class="center">
        JS-Divergence:
      </div>
      <div id="js-divergence-val">
        {js_divergence}
      </div>
    </div>
  </div>
</div> 

