import * as d3 from 'd3'
import { data_labels } from '../utils/data_labels.js'
import { 
  pad_number,
  capitalize
 } from '../utils/helper.js'
import { 
  color_dict, 
  bg_img_style 
} from '../utils/constant.js'
import { 
  frame_info, 
  data_dir,
  data_path,
  set_data_dir,
  update_data_path,
  y_line_chart,
  attack_strength,
  attack_type
} from '../utils/variable.js'
import {
  draw_curr_frame,
  show_background_video_frame,
  gen_skeleton,
  gen_frame_comparison_plot
} from '../FrameView/FrameView.js'

import {
  gen_predicted,
  update_class_labels
} from '../SeparateView/SeparateView.js'

import { update_dist_plot } from '../DistributionView/DistributionView.svelte'

export function gen_overlap_header(header) {
  header.innerText = "";
  // Texts to write
  let texts = {
    'weakly': {
      'text': 'Weaker',
      'color': color_dict['weak'],
      'font-weight': 'bold'
    },
    'plus': {
      'text': '+',
      'color': color_dict['normal'],
      'font-weight': 'normal'
    },
    'strongly': {
      'text': 'Stronger',
      'color': color_dict['strong'],
      'font-weight': 'bold'
    },
    'attacked': {
      'text': 'Attack',
      'color': color_dict['normal'],
      'font-weight': 'normal'
    }
  }

  // Write header texts
  for (let t in texts) {
    let text_div = document.createElement('div')
    text_div.id = `overlap-view-header-text-${t}`
    if (texts[t]['text'] == 'Weaker' && attack_strength.weak == 0) {
      text_div.innerText = 'Benign';
    } else {
      text_div.innerText = texts[t]['text']
    }
    text_div.style.color = texts[t]['color']
    text_div.style.fontWeight = texts[t]['font-weight']
    text_div.style.paddingLeft = '2px'
    text_div.style.paddingRight = '2px'
    header.append(text_div)
  }

}

export function gen_background(background) {

  // Set size of svg
  d3.select('#overlap-view-svg')
    .style('width', (bg_img_style['overlap']['width'] + 5) + 'px')
    .style('height', (bg_img_style['overlap']['height'] + 5) + 'px')

  // Add background image
  let frame_id = pad_number(frame_info['curr'], 3, 0)
  let bg_img = background
    .append('image')
    .attr('id', 'overlap-view-bg-img')
    .attr('href', `${data_path['benign_frame_dir']}/frame-${frame_id}.png`)
    .attr('width', bg_img_style['overlap']['width'])
    .attr('height', bg_img_style['overlap']['height'])
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .style('width', bg_img_style['overlap']['width'] + 'px')
    .style('height', bg_img_style['overlap']['height'] + 'px')

  // Add background mask
  let bg_img_mask = background
    .append('rect')
    .attr('id', 'overlap-view-bg-img-mask')
    .style('width', bg_img_style['overlap']['width'] + 'px')
    .style('height', bg_img_style['overlap']['height'] + 'px')
    .style('fill', 'white')
    .style('opacity', 0.7)

  // // Add background image border
  // let [mv_x, mv_y] = [1.5, 1.5]
  // let bg_img_border = background
  //   .append('rect')
  //   .attr('id', 'overlap-view-bg-img-border')
  //   .style('width', bg_img_style['overlap']['width'] + 'px')
  //   .style('height', bg_img_style['overlap']['height'] + 'px')
  //   .style('fill', 'transparent')
  //   .style('stroke', color_dict['bg-img-border'])
  //   .style('stroke-width', bg_img_style['overlap']['stroke-width'] + 'px')
  //   .style('transform', `translate(${mv_x}px, ${mv_y}px)`)

}

export function gen_class_info(overlap_class_info) {

  let weak_info = overlap_class_info.children[0]
  let strong_info = overlap_class_info.children[1]

  d3.json(data_path['class_labels']).then(function(data) {
    let true_label = data['true']
    
    var strong_label_path = 'pred-attack-'
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

    let strong_label = data[strong_label_path]
    let weak_label = data['pred-benign']

    gen_predicted('weak', weak_label)
    gen_predicted('strong', strong_label)
    
  })

  // function gen_class_info_one_case(item, parent_div, true_l, pred_l) {
  //   // Title
  //   var title = document.createElement('div')
  //   title.innerText = capitalize(`${item}ly attacked`)
  //   title.style.color = color_dict[item]
  //   title.style.fontWeight= 'bold'
  //   parent_div.appendChild(title)

  //   // True action
  //   var true_action_div = document.createElement('div')
  //   var true_action_text = document.createElement('div')
  //   var true_action_label = document.createElement('div')
  //   true_action_text.innerText = 'True action:'
  //   true_action_text.style.paddingRight = '5px'
  //   true_action_text.style.fontWeight = 'bold'
  //   true_action_label.id = `${item}-true-label`
  //   true_action_label.innerText = data_labels[true_l]
  //   true_action_div.style.display = 'flex'
  //   true_action_div.appendChild(true_action_text)
  //   true_action_div.appendChild(true_action_label)
  //   parent_div.appendChild(true_action_div)

  //   // Predicted action
  //   var pred_action_div = document.createElement('div')
  //   var pred_action_text = document.createElement('div')
  //   var pred_action_label = document.createElement('div')
  //   pred_action_text.innerText = 'Predicted action:'
  //   pred_action_text.style.paddingRight = '5px'
  //   pred_action_text.style.fontWeight = 'bold'
  //   pred_action_label.id = `${item}-pred-label`
  //   pred_action_label.innerText = data_labels[pred_l]
  //   pred_action_div.style.display = 'flex'
  //   pred_action_div.appendChild(pred_action_text)
  //   pred_action_div.appendChild(pred_action_label)
  //   parent_div.appendChild(pred_action_div)
  // }    
}

