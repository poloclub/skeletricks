import * as d3 from 'd3'
import noUiSlider from 'nouislider';
import { pad_number } from '../utils/helper.js'
import { update_curr_skeleton } from '../FrameView/FrameView.js'
import { 
  icon_class,
  color_dict, 
  bg_img_style,
  time_style
} from '../utils/constant.js'
import { 
  attack_strength,
  data_path,
  frame_info, 
  separate_view_skeleton,
  update_attack_strength, 
  data_dir,
  y_line_chart,
  update_data_path,
  attack_type
} from '../utils/variable.js'
import { data_labels } from '../utils/data_labels.js'
import {
  update_dist_plot
} from '../DistributionView/DistributionView.svelte'
import { gen_overlap_header } from '../OverlapView/OverlapView.js'
import {
  draw_curr_frame,
  show_background_video_frame,
  gen_skeleton,
  gen_frame_comparison_plot,
  gen_frames
} from '../FrameView/FrameView.js'

export function gen_separate_header(input_type, header) {
  // header.innerText = "";
  // Texts to write
  let texts = {
    'weak': {
      'text': ['Weaker:', ''],
      'font-weight': 'bold'
    },
    'strong': {
      'text': ['Stronger:', ''],
      'font-weight': 'bold'
    },
  }

  // Write header text
  for (let i of [0, 1]) {
    let text_div = document.getElementById(`${input_type}-title-${i}`)
    if (texts[input_type]['text'][i] == 'Weaker:' && attack_strength.weak == 0) {
      text_div.innerText = 'Benign:';
    } else {
      text_div.innerText = texts[input_type]['text'][i]
    }
    text_div.style.color = color_dict[input_type]
    text_div.style.fontWeight = texts[input_type]['font-weight']
  }
}

export function gen_predicted(item, pred_l) {
  var pred_action_div = document.getElementById(`${item}-predicted-wrapper`)
  pred_action_div.style.color = "#999999";
  pred_action_div.style.fontSize = "0.85rem"
  var pred_action_text = document.getElementById(`${item}-predicted`)
  var pred_action_label = document.getElementById(`${item}-predicted-value`)
  pred_action_text.innerText = 'Predicted:'
  pred_action_text.style.paddingRight = '5px'
  pred_action_label.innerText = data_labels[pred_l]
  pred_action_div.style.display = 'flex'
  pred_action_text.style.width = ""
  pred_action_div.style.paddingBottom = "10px";
}

export function update_class_labels() {
  // Load labels from data_path['class_labels']
  d3.json(data_path['class_labels']).then(function(data) {


    // TODO: Can have different key
    var strong_label_path = 'pred-attack-'
    if (attack_strength.strong == 0) {
      strong_label_path = "pred-benign";
    } else {
      var attack_strong;
      if (attack_strength.strong == 1) {
        attack_strong = "001"
      } else if (attack_strength.strong == 2) {
        attack_strong = "002";
      } else if (attack_strength.strong == 4) {
        attack_strong = "004";
      } else if (attack_strength.strong == 8) {
        attack_strong = "008";
      } else if (attack_strength.strong == 16) {
        attack_strong = "016";
      } else if (attack_strength.strong == 32) {
        attack_strong = "032";
      } else if (attack_strength.strong == 64) {
        attack_strong = "064";
      } else if (attack_strength.strong == 128) {
        attack_strong = "128";
      }
      var attackTypeUse = "pgd"
      if (attack_type == "patch") {
        attackTypeUse = "patch10pgd"
      }

      strong_label_path += attackTypeUse + attack_strong
    }

    var weak_label_path = 'pred-attack-'
    if (attack_strength.weak == 0) {
      weak_label_path = "pred-benign";
    } else {
      var attack_weak;
      if (attack_strength.weak == 1) {
        attack_weak = "001"
      } else if (attack_strength.weak == 2) {
        attack_weak = "002";
      } else if (attack_strength.weak == 4) {
        attack_weak = "004";
      } else if (attack_strength.weak == 8) {
        attack_weak = "008";
      } else if (attack_strength.weak == 16) {
        attack_weak = "016";
      } else if (attack_strength.weak == 32) {
        attack_weak = "032";
      } else if (attack_strength.weak == 64) {
        attack_weak = "064";
      } else if (attack_strength.weak == 128) {
        attack_weak = "128";
      }
      var attackTypeUse = "pgd"
      if (attack_type == "patch") {
        attackTypeUse = "patch10pgd"
      }

      weak_label_path += attackTypeUse + attack_weak
    }

    let strong_label = data_labels[data[strong_label_path]]
    let weak_label = data_labels[data[weak_label_path]]


    let weak_pred = document.getElementById('weak-predicted-value')
    weak_pred.innerText = weak_label

    let strong_pred = document.getElementById('strong-predicted-value')
    strong_pred.innerText = strong_label

  })

}
  
export function gen_combined_slider(parent_div) {
  var slider = document.getElementById('epsilon-slider');

  if (!slider.hasChildNodes()) {
    noUiSlider.create(slider, {
        start: [0, 8],
        range: {
          'min': [0, 1],
          '12.5%': [1, 1],
          '25%': [2, 2],
          '37.5%': [4, 4],
          '50%': [8, 8],
          '62.5%': [16, 16],
          '75%': [32, 32],
          '87.5%': [64, 64],
          'max': [128]
        },
    });
  }
  slider.style.margin = "0.25rem";

  var weakerText = document.getElementById('weak-strength');
  var strongerText = document.getElementById('strong-strength');

  weakerText.style.color = color_dict['weak'];
  weakerText.style.paddingLeft = "5px";
  strongerText.style.color = color_dict['strong'];
  strongerText.style.paddingLeft = "5px";

  weakerText.innerHTML = " " + Math.floor(slider.noUiSlider.get()[0]);
  strongerText.innerHTML = " " + Math.floor(slider.noUiSlider.get()[1]);

  var weakerHeader = document.getElementById('weak-title-0');
  var distWeakLabel = document.getElementById('curr-weakly-label');
  update_attack_strength('weak', 0);
  update_attack_strength('strong', 8);

  slider.noUiSlider.on('set', function() {
    var weakerVal = slider.noUiSlider.get()[0];
    var strongerVal = slider.noUiSlider.get()[1];
    weakerText.innerHTML = " " + Math.floor(weakerVal);
    strongerText.innerHTML = " " + Math.floor(strongerVal);

    update_attack_strength('weak', weakerVal);
    update_attack_strength('strong', strongerVal);
    update_data_path();
    update_class_labels();

    update_dist_plot(data_dir, y_line_chart['selected'], 
                     weakerVal, strongerVal)
    var overlapHeader = document.getElementById('overlap-view-header')
    gen_frame_comparison_plot();
    gen_overlap_header(overlapHeader);

    draw_curr_frame()
    show_background_video_frame()
    gen_skeleton()
    

    if (attack_strength.weak == 0) {
      weakerHeader.innerHTML = "Benign:";
      distWeakLabel.innerHTML = "Benign:";
    } else {
      weakerHeader.innerHTML = "Weaker:";
      distWeakLabel.innerHTML = "Weaker:";
    }
  })

}

export function gen_background(background, input_type) {

  // Set size of svg
  d3.select(`#${input_type}-view-svg`)
  .style('width', (bg_img_style['separate']['width'] + 5) + 'px')
  .style('height', (bg_img_style['separate']['height'] + 5) + 'px')

  // Add background image
  let frame_id = pad_number(frame_info['curr'], 3, 0)
  let bg_img = background
    .append('image')
    .attr('id', `${input_type}-view-bg-img`)
    .attr('href', `${data_path[`${input_type}_frame_dir`]}/frame-${frame_id}.png`)
    .attr('width', bg_img_style['separate']['width'])
    .attr('height', bg_img_style['separate']['height'])
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .style('width', bg_img_style['separate']['width'] + 'px')
    .style('height', bg_img_style['separate']['height'] + 'px')
    .style('-webkit-appearance', 'none')

  // Add background mask
  let bg_img_mask = background
    .append('rect')
    .attr('id', `${input_type}-view-bg-img-mask`)
    .style('width', bg_img_style['separate']['width'] + 'px')
    .style('height', bg_img_style['separate']['height'] + 'px')
    .style('fill', 'white')
    .style('opacity', 0.7)

  // // Add background image border
  // let [mv_x, mv_y] = [1.5, 1.5]
  // let bg_img_border = background
  //   .append('rect')
  //   .attr('id', `${input_type}-view-bg-img-border`)
  //   .style('width', bg_img_style['separate']['width']+ 'px')
  //   .style('height', bg_img_style['separate']['height'] + 'px')
  //   .style('fill', 'transparent')
  //   .style('stroke', color_dict['bg-img-border'])
  //   .style('stroke-width', bg_img_style['separate']['stroke-width'] + 'px')
  //   .style('transform', `translate(${mv_x}px, ${mv_y}px)`)

}

export function gen_frame_range_selection() {

  // gen_skeleton_for_one_frame_option()
  gen_skeleton_for_frame_range_option()

  function gen_skeleton_for_one_frame_option() {

    // Check icon
    let check_icon_g = d3.select('#skeleton-one-frame-icon')
      .append('g')
      .attr('id', 'skeleton-one-frame-check-icon')
      .style('display', 'inline-block')

    let check_icon = check_icon_g
      .append('i')
      .attr('class', icon_class['check'])

    // Uncheck icon
    let uncheck_icon_g = d3.select('#skeleton-one-frame-icon')
      .append('g')
      .attr('id', 'skeleton-one-frame-uncheck-icon')
      .style('display', 'none')
      .style('color', '#878787')
      .on('click', function() {
        d3.select(this).style('display', 'none')
        d3.select('#skeleton-one-frame-check-icon').style('display', 'inline-block')
        d3.select('#skeleton-frame-range-check-icon').style('display', 'none')
        d3.select('#skeleton-frame-range-uncheck-icon').style('display', 'inline-block')
        separate_view_skeleton['frame'] = 'one'
        update_curr_skeleton()
      })
    
    let uncheck_icon = uncheck_icon_g
      .append('i')
      .attr('class', icon_class['uncheck'])
      .style('cursor', 'pointer')

    // Add text
    let option_text = document.getElementById('skeleton-one-frame-text')
    option_text.innerText = 'Skeleton for frame 0'
  }

  function gen_skeleton_for_frame_range_option() { 

    // // Check icon
    // let check_icon_g = d3.select('#skeleton-frame-range-icon')
    //   .append('g')
    //   .attr('id', 'skeleton-frame-range-check-icon')
    //   .style('display', 'none')

    // check icon
    let check_icon_g = d3.select('#skeleton-frame-range-icon')
    .append('g')
    .attr('id', 'skeleton-frame-range-check-icon')
    .style('display', 'none')
    .on('click', function() {
      if (this.style.display == 'none') {
        d3.select(this).style('display', 'inline-block')
        d3.select('#skeleton-frame-range-uncheck-icon').style('display', 'none')
        separate_view_skeleton['frame'] = 'range'
      } else {
        d3.select(this).style('display', 'none')
        d3.select('#skeleton-frame-range-uncheck-icon').style('display', 'inline-block')
        separate_view_skeleton['frame'] = 'one'
      }

      update_curr_skeleton()
    })
    
    let check_icon = check_icon_g
      .append('i')
      .attr('class', icon_class['check'])

    // Uncheck icon
    let uncheck_icon_g = d3.select('#skeleton-frame-range-icon')
      .append('g')
      .attr('id', 'skeleton-frame-range-uncheck-icon')
      .style('display', 'inline-block')
      .on('click', function() {
        if (this.style.display == 'none') {
          d3.select(this).style('display', 'inline-block')
          d3.select('#skeleton-frame-range-check-icon').style('display', 'none')
          separate_view_skeleton['frame'] = 'one'
        } else {
          d3.select(this).style('display', 'none')
          d3.select('#skeleton-frame-range-check-icon').style('display', 'inline-block')
          separate_view_skeleton['frame'] = 'range'
        }

        update_curr_skeleton()
      })
    
    let uncheck_icon = uncheck_icon_g
      .append('i')
      .attr('class', icon_class['uncheck'])
      .style('cursor', 'pointer')

    // Add text
    let option_text = document.getElementById('skeleton-frame-range-text')
    option_text.innerText = 'Skeleton for frame 0-10'
    option_text.style.color = "#878787"
  }

}