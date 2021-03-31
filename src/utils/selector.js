import * as d3 from 'd3'
import { data_labels } from '../utils/data_labels.js'
import { 
  pad_number,
  capitalize
 } from '../utils/helper.js'
import { 
  color_dict, 
  bg_img_style,
  used_videos
} from '../utils/constant.js'
import { 
  frame_info, 
  data_dir,
  data_path,
  set_data_dir,
  update_data_path,
  y_line_chart,
  attack_strength,
  attack_type,
  set_attack_type
} from '../utils/variable.js'
import {
  draw_curr_frame,
  show_background_video_frame,
  gen_skeleton,
  gen_frame_comparison_plot,
  gen_frames
} from '../FrameView/FrameView.js'

import {
  gen_predicted,
  update_class_labels
} from '../SeparateView/SeparateView.js'

import { update_dist_plot } from '../DistributionView/DistributionView.svelte'
import { gen_sub_frames } from '../FrameView/FrameView.js'


export function gen_selector() {
    var background = document.getElementById("selector");
    background.style.width = "100%";
    background.style.backgroundColor = "#F3F3F3";

    var contentWrapper = document.createElement("div");
    contentWrapper.id = "selector-content-wrapper"
    contentWrapper.style.display = "flex"
    contentWrapper.style.padding = "0.25rem"
    background.appendChild(contentWrapper);

    var itemSelectorWrapper = document.createElement("div")
    itemSelectorWrapper.id = "selector-item-wrapper"
    itemSelectorWrapper.style.display = 'flex'
    itemSelectorWrapper.style.alignItems = "center"
    itemSelectorWrapper.style.paddingRight = "2rem"
    contentWrapper.appendChild(itemSelectorWrapper)

    var itemSelectorText = document.createElement("div")
    itemSelectorText.id = "selector-item-text"
    itemSelectorText.innerText = "Video Action: "
    itemSelectorText.style.fontSize = "1.2rem";
    itemSelectorWrapper.appendChild(itemSelectorText)

    var itemSelectorParent = document.createElement("div")
    itemSelectorText.id = "selector-item-parent"
    itemSelectorText.style.marginLeft = "10px";
    itemSelectorWrapper.appendChild(itemSelectorParent)

    gen_class_choose(itemSelectorParent);


    var attackSelectorWrapper = document.createElement("div")
    attackSelectorWrapper.id = "attack-item-wrapper"
    attackSelectorWrapper.style.display = "flex"
    attackSelectorWrapper.style.alignItems = "center"
    contentWrapper.appendChild(attackSelectorWrapper)

    var attackSelectorText = document.createElement("div")
    attackSelectorText.id = "attack-item-text"
    attackSelectorText.innerText = "Attack Type: "
    attackSelectorText.style.fontSize = "1.2rem"
    attackSelectorWrapper.appendChild(attackSelectorText)

    var attackSelectorParent = document.createElement("div")
    attackSelectorText.id = "attack-item-parent"
    attackSelectorWrapper.appendChild(attackSelectorParent)

    gen_attack_choose(attackSelectorParent);


}

function gen_attack_choose(parent_div) {
  let to_call = [
    draw_curr_frame,
    show_background_video_frame,
    gen_skeleton,
    gen_frame_comparison_plot // XXXXXX
  ]

  var dropdown = document.createElement('select')
  dropdown.id = "selector-item"
  
  var child1 = document.createElement('option')
  child1.value = "Patch"
  child1.innerText = "Patch"
  dropdown.appendChild(child1)

  var child2 = document.createElement('option')
  child2.value = "PGD"
  child2.innerText = "PGD"
  dropdown.appendChild(child2)

  dropdown.style.borderWidth = "0px 0px 1px 0px"
  dropdown.style.background = "none"
  dropdown.style.borderColor = "#999999"

  dropdown.onchange = function(event) {
    set_attack_type(dropdown.options[dropdown.selectedIndex].value.toLowerCase());
    update_data_path();
    update_class_labels()

    update_dist_plot(null, null, null, null, null, dropdown.options[dropdown.selectedIndex].value.toLowerCase())
    gen_frame_comparison_plot();

    draw_curr_frame()
    show_background_video_frame()
    gen_skeleton()


  }
  parent_div.appendChild(dropdown)
}

  async function gen_class_choose(parent_div) {
    let to_call = [
        draw_curr_frame,
        show_background_video_frame,
        gen_skeleton,
        gen_frame_comparison_plot // XXXXXX
      ]
    var dropdown = document.createElement('select')
    dropdown.id = "selector-item"

    dropdown.style.borderWidth = "0px 0px 1px 0px"
    dropdown.style.background = "none"
    dropdown.style.borderColor = "#999999"
    dropdown.style.color = "#4a4a4a"

    var indexLunges = 0;
    var foundLunges = 0;

    for (var i = 0; i <= 98; i++) {
      if (used_videos.includes(i)) {
        var numString = String(i)

        while (numString.length < 5) {
          numString = "0" + numString
        }
        var child = document.createElement('option')
        var true_label = "";
        child.value = "item-" + numString
        var path = `${attack_type}_interpolated_data/${child.value}/class_labels.json`;
        await d3.json(path).then(function(data) {
          true_label = data_labels[data['true']]
        })
        child.innerText = true_label
        // child.innerText = child.value
        dropdown.appendChild(child)
        if (child.value == "item-00018") {
          foundLunges = 1;
        }
        if (foundLunges == 0) {
          indexLunges += 1;
        }
      }
    }

    dropdown.selectedIndex = indexLunges;

    dropdown.onchange = function(event) {
      set_data_dir(dropdown.options[dropdown.selectedIndex].value)
      update_data_path()
      update_class_labels()
      update_dist_plot(data_dir, 
                       y_line_chart.selected, 
                       attack_strength.weak, 
                       attack_strength.strong, 
                       y_line_chart.selected.includes('joint')? 'displacement-average':'angle-change')

      to_call.forEach(element => {
        element()
      });

      var weak_frames_pass = d3.select('#weak-frames')
      var strong_frames_pass = d3.select('#strong-frames')

      var weak_frames = document.getElementById('weak-frames')
      var strong_frames = document.getElementById('strong-frames')
      while (weak_frames.firstChild) {
        weak_frames.removeChild(weak_frames.firstChild);
    }
      while (strong_frames.firstChild) {
        strong_frames.removeChild(strong_frames.firstChild);
    }
      gen_frames(weak_frames_pass)
      gen_frames(strong_frames_pass)

    }
    set_data_dir(dropdown.options[dropdown.selectedIndex].value)
    update_data_path()
    parent_div.append(dropdown)
    gen_frame_comparison_plot()
  }
