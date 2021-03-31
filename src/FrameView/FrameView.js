import * as d3 from 'd3'
import { 
  round_off, 
  pad_number,
  get_absolute_coord, 
  mk_1st_letter_capital
} from '../utils/helper.js'
import { 
  frame_option, 
  frame_info, 
  plot_value, 
  separate_view_skeleton, 
  skeleton_data, 
  data_path,
  data_dir,
  y_line_chart,
  attack_strength,
  week_std_dev,
  week_avg,
  set_week_std_dev,
  set_week_avg
} from '../utils/variable.js'
import { 
  icon_class, layout_style, bg_img_style, keypoints, skeletons,
  color_dict, control_style, frame_style, control_board_style,
  time_style
} from '../utils/constant.js'
import {
  Dropdown
} from '../utils/dropdown.js'
import {
  update_dist_plot
} from '../DistributionView/DistributionView.svelte'
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)


//////////////////////////////////////////////////////////////////
// Generate frame control
//////////////////////////////////////////////////////////////////
export function gen_frame_control(frame_control) {

  // Input type
  let input_type = frame_control.attr('id').split('-')[0]

  // Generate background control
  gen_background_options(frame_control, input_type)

  // Move frame_control
  frame_control.style('transform', 'translate(0px, ' + control_style[input_type] + 'px)')
   
}

function gen_background_options(frame_control, input_type) {

  // Background control div
  let bg_control = frame_control
    .select('.background-control')
    .style('cursor', 'pointer')
    .on('click', function() {
      let bg_control_board = d3.select(`#${input_type}-background-control-board`)
      let dropdown_down_icon = d3.select(`#${input_type}-background-dropdown-down`)
      let dropdown_up_icon = d3.select(`#${input_type}-background-dropdown-up`)
      if (bg_control_board.style('display') == 'none') {
        bg_control_board.style('display', 'inline-block')
        dropdown_down_icon.style('display', 'none')
        dropdown_up_icon.style('display', 'inline-block')
      } else {
        bg_control_board.style('display', 'none')
        dropdown_down_icon.style('display', 'inline-block')
        dropdown_up_icon.style('display', 'none')
      }
    })

  // Generate icon
  let bg_icon = bg_control
    .select('.control-icon')
    .append('i')
    .attr('class', icon_class['background'])

  // Generate title
  let bg_title = bg_control
    .select('.control-title')
    .text('Frame background:')

  // Generate option selection
  let bg_selection = bg_control
    .select('.control-selection')
    .text(frame_option[input_type]['background'])

  // Generate dropdown-down icon
  let bg_dropdown_icon = bg_control
    .select('.control-dropdown-icon')
    .append('i')
    .attr('id', `${input_type}-background-dropdown-down`)
    .attr('class', ['dropdown-down', icon_class['dropdown-down']].join(' '))
    .style('display', 'inline-block')

  // Generate dropdown-up icon
  let bg_dropdown_up_icon = bg_control
    .select('.control-dropdown-icon')
    .append('i')
    .attr('id', `${input_type}-background-dropdown-up`)
    .attr('class', ['dropdown-up', icon_class['dropdown-up']].join(' '))
    .style('display', 'none')

}

//////////////////////////////////////////////////////////////////
// Generate frames
//////////////////////////////////////////////////////////////////
export function gen_frames(frames) {
  // Input type
  let input_type = frames.attr('id').split('-')[0]

  // Frame size
  let w = bg_img_style['frame']['width']
  let h = bg_img_style['frame']['height']

  // Number of frames
  let frame_canvas_w = layout_style['frame-view-width']
  let num_thumbnails = parseInt(frame_canvas_w / w)
  let num_subframes = parseInt(frame_info['total_frames'] / num_thumbnails)
  frame_info['num_thumbnails'] = num_thumbnails
  frame_info['num_subframes'] = num_subframes
  frame_info['canvas-w'] = num_thumbnails * w
  frame_info['max_frame'] = num_subframes * num_thumbnails

  // Thumbnail frames
  for (var i = 0; i < num_thumbnails; i++) {

    // Generate thumbnail frame div
    let frame_div = frames
      .append('div')
      .attr('id', `${input_type}-frame-${i}-div`)
      .style('display', 'inline-block')

    // Generate thumbnail frame svg
    let frame_svg = frame_div
      .append('svg')
      .attr('id', `${input_type}-frame-${i}-svg`)
      .style('width', w + 'px')
      .style('height', h + 'px')
      .style('cursor', 'pointer')
      .on('click', function() {

        // Update current frame
        let thumb_i = parseInt(d3.select(this).attr('id').split('-')[2])
        let frame_i = thumb_i * num_subframes + parseInt(num_subframes / 2)
        frame_info['curr'] = frame_i

        // Move time slider knob
        move_knob()

        // Draw the current frame
        draw_curr_frame()

        // Update skeleton
        update_curr_skeleton()
      })

    // Append thumbnail image
    let frame_i = i * num_subframes
    let frame_id = pad_number(frame_i, 3, 0)
    let thumbnail_frame = frame_svg
      .append('image')
      .attr('id', `${input_type}-thumbnail-image-${i}`)
      .attr('class', `${input_type}-thumbnail`)
      // TODO: Correct path for corresponding attack strength
      // .attr('href', `${data_path[`${input_type}_frame_dir`]}/frame-${frame_id}.png`)
      .attr('href', `${data_path['weak_frame_dir']}/frame-${frame_id}.png`)
      .attr('width', w)
      .attr('height', h)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .style('width', w + 'px')
      .style('height', h + 'px')

    // Append thumbnail image border
    let frame_border = frame_svg
      .append('rect')
      .attr('id', `${input_type}-thumbnail-border-${i}`)
      .attr('class', `${input_type}-thumbnail-border thumbnail-border`)
      .style('width', w + 'px')
      .style('height', h + 'px')
      .style('fill', 'transparent')
      .style('stroke-width', function() {
        if (i == 0) {
          return frame_style[`${input_type}`]['stroke-width'] + 'px'
        } else {
          return frame_style['default']['stroke-width'] + 'px'
        }
      })
      .style('stroke', function() {
        if (i == 0) {
          return color_dict[`${input_type}`]
        } else {
          return color_dict['bg-img-border']
        }
      })
  }

  // Move frames
  frames.style('transform', 'translate(0px, ' + frame_style[input_type]['y'] + 'px)')

}

export function gen_sub_frames(sub_frames) {

  // Input type
  let input_type = sub_frames.attr('id').split('-')[0]

  // Frame size
  let num_subframes = frame_info['num_subframes']
  let w = bg_img_style['frame']['width'] / num_subframes
  let h = bg_img_style['frame']['height'] / num_subframes

  // Append subframes
  let num_thumbnails = frame_info['num_thumbnails']
  let total_subframes = num_thumbnails * num_subframes
  for (var i = 0; i < total_subframes; i++) {

    // Find the thubmnail
    let thumbnail = parseInt(i / num_subframes)

    // Generate subframe div
    let frame_div = sub_frames
      .append('div')
      .attr('id', `${input_type}-subframe-${i}-div`)
      .attr('class', `${input_type}-subframe-thunmbnail-${thumbnail}-div`)
      .style('display', 'inline-block')

    // Generate subframe svg
    let frame_svg = frame_div
      .append('svg')
      .attr('id', `${input_type}-subframe-${i}-svg`)
      .attr('class', `${input_type}-subframe-thunmbnail-${thumbnail}-svg`)
      .style('width', w + 'px')
      .style('height', h + 'px')

    // Append subframe image
    let sub_frame = frame_svg
      .append('image')
      .attr('href', `${data_path[`${input_type}_frame_dir`]}/frame-${pad_number(i, 3, 0)}.png`)
      .style('width', w + 'px')
      .style('height', h + 'px')
      .attr('preserveAspectRatio', 'xMinYMin meet')

  }

}

//////////////////////////////////////////////////////////////////
// Generate frame comparison view
//////////////////////////////////////////////////////////////////

export function gen_frame_comparison_plot() {
 
  let data_list = [
    data_path['weak_displacement_filepath'],
    data_path['strong_displacement_filepath'],
    data_path['weak_angle_filepath'],
    data_path['strong_angle_filepath']
  ]

  console.log(data_list);
  
  Promise.all([
    // TODO: Need to read correct data for the selected attack strength
    d3.csv(data_list[0]),
    d3.csv(data_list[1]),
    d3.csv(data_list[2]),
    d3.csv(data_list[3]),
  ]).then(function(files) {

    // Parse data
    let weak_dis_data = gen_avg_displacement(
      files[0].slice(0, frame_info['max_frame'] - 1)
    )
    let strong_dis_data = gen_avg_displacement(
      files[1].slice(0, frame_info['max_frame'] - 1)
    )
    let weak_angle_data = parse_angle_data(
      files[2].slice(0, frame_info['max_frame'] - 1)
    )
    let strong_angle_data = parse_angle_data(
      files[3].slice(0, frame_info['max_frame'] - 1)
    )

    weak_dis_data.forEach((e, i) => {
      if (isNaN(e)) {
        weak_dis_data[i] = 0
      }
    })

    strong_dis_data.forEach((e, i) => {
      if (isNaN(e)) {
        strong_dis_data[i] = 0
      }
    })
    
    for (let key in weak_angle_data) {
      weak_angle_data[key].forEach((e, i) => {
        if (isNaN(e)) {
          weak_angle_data[key][i] = 0
        }
      })
    }
    
    for (let key in strong_angle_data) {
      strong_angle_data[key].forEach((e, i) => {
        if (isNaN(e)) {
          strong_angle_data[key][i] = 0
        }
      })
    }

    draw_line_chart(
      [weak_dis_data, strong_dis_data, weak_angle_data, strong_angle_data],
      y_line_chart['selected']
    )    
    add_y_label_dropdown(
      [weak_dis_data, strong_dis_data, weak_angle_data, strong_angle_data],
      y_line_chart['selected']
    )

  })
}

function gen_avg_displacement(data) {
  let avg = []
  data.forEach(d => {
    let s = Object.values(d).reduce((a, b) => parseFloat(a) + parseFloat(b))
    s = (s - parseFloat(d['frame_id'])) / frame_info['max_frame']
    avg.push(s)
  })
  return avg
}

function parse_angle_data(data) {
  let angle_data = {}
  data.forEach(d => {
    for (let k in d) {

      if (!(k in angle_data)) {
        angle_data[k] = []
      }

      if (k != 'frame_id') {
        angle_data[k].push(parseFloat(d[k]))
      }
    }
  })
  return angle_data
}

function draw_line_chart(data, item) {

  // Refresh views
  d3.select('#plot-svg').remove()

  // Size of the plot view
  let frame_comparison = d3.select('#frame-comparison-view')
  let w = parseInt(frame_comparison.style('width'))
  let h = parseInt(frame_comparison.style('height'))

  // TODO: move w_pad and h_pad to constant.js
  let w_pad = 20
  let h_pad = 20

  // Add svg
  let svg = d3.select('#frame-comparison-view')
    .append('svg')
    .attr('id', 'plot-svg')
    .style('width', (w + w_pad + w_pad) + 'px')
    .style('height', (h + h_pad) + 'px')

  // Add highlight background
  let highlight_bg = svg
    .append('g')
    .attr('id', 'highlight-bg')
    .append('rect')
    .attr('width', bg_img_style['frame']['width'])
    .attr('height', h - h_pad)
    .style('fill', '#eeeeee')

  // Add frame line
  let frame_line = svg
    .append('line')
    .attr('id', 'frame-line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', h - h_pad)
    .style('stroke', 'black')
    .style('stroke-dasharray', ('3, 3'))

  // X-scale
  let x_scale = d3.scaleLinear()
    .domain([frame_info['min_frame'], frame_info['max_frame'] + 5])
    .range([0, w])
  
  // Y value range
  let [y_min, y_max] = [1000, 0]
  if (y_line_chart['selected'].includes('joint')) {
    y_max = d3.max([
      d3.max(data[0]), d3.max(data[1])
    ])
    y_min = d3.min([
      d3.min(data[0]), d3.min(data[1])
    ])
  } else {
    y_max = d3.max([
      d3.max(data[2][item]), d3.max(data[3][item])
    ])
    y_min = d3.min([
      d3.min(data[2][item]), d3.min(data[3][item])
    ])
  }
  
  // Y-scale 
  let y_scale = d3.scaleLinear()
    .domain([y_min, y_max])
    .range([(h - h_pad), h_pad])

  // Add x axis
  let tick_values = []
  for (var i = 0; i < frame_info['num_thumbnails']; i++) {
    tick_values.push(i * frame_info['num_subframes'])
  }
  let x_axis = svg
    .append('g')
    .attr('id', 'x-axis')
    .call(
      d3.axisBottom(x_scale)
        .tickValues(tick_values)
    )
    .style('transform', `translate(0px,${h - h_pad}px`)

  x_axis.select('.tick')
    .select('text')
    .style('transform', 'translate(2px, 0px)')

  let y_axis = svg
    .append('g')
    .attr('id', 'y-axis')
    .call(d3.axisLeft(y_scale))
    .style('transform', `translate(${w}px,0px`)

  // Add plot
  plot_value['all'].forEach(plot_type => {
    
    // Data
    let curr_data = []
    if (item.includes('joint')) {
      if (plot_type.includes('weak')) {
        curr_data = data[0]
        set_week_std_dev(math.std(curr_data))
        set_week_avg(math.mean(curr_data))
      } else {
        curr_data = data[1]
      }
    } else {
      if (plot_type.includes('weak')) {
        curr_data = data[2][item]
        set_week_std_dev(math.std(curr_data))
        set_week_avg(math.mean(curr_data))
      } else {
        curr_data = data[3][item]
      }
    }

    // Generate g for dots
    let g_dots = svg
      .append('g')
      .attr('id', `plot-dots-${plot_type}`)

    // Add dots
    let dots = g_dots
      .selectAll('circle')
      .data(curr_data)
      .enter()
      .append('circle')
      .attr('r', 2.5)
      .attr('cx', function (d, i) {          
        return x_scale(i)
      })
      .attr('cy', function (d, i) {
        let y = y_scale(d)
        if (isNaN(y)) {
          return y_scale(y_max)
        } else {
          return y
        }
      })
      .attr('fill', plot_value['color'][plot_type])
    
    // Generate g for line (path)
    let g_line = svg
      .append('g')
      .attr('id', `plot-line-${plot_type}`)

    // Add line        
    let line = g_line
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', plot_value['color'][plot_type])
      .attr('stroke-width', 1.5)
      .attr('d', function() {
        return d3.line()
          .x(function(d, i) {
            return x_scale(i)
          })
          .y(function(d, i) {
            let y = y_scale(d)
              if (isNaN(y)) {
                return y_scale(y_max)
              } else {
                return y
              }
          })
          (curr_data)
      })

    let std_dev_line_one = svg
      .append('g')
      .attr('id', `plot-line-${plot_type}`)

    let sd_line_y_one = week_avg - week_std_dev
    let sd_line_y_two = week_avg + week_std_dev

    let sd_line_one = std_dev_line_one
      .append('line')
      .style("stroke", '#CDCDCD')
      .style("stroke-width", 2)
      .style("stroke-dasharray","2,2")
      .attr("x1", 0)
      .attr("y1", y_scale(sd_line_y_one))
      .attr("x2", w)
      .attr("y2", y_scale(sd_line_y_one))
    
      let std_dev_line_two = svg
      .append('g')
      .attr('id', `plot-line-${plot_type}`)

    let sd_line_two = std_dev_line_two
      .append('line')
      .style("stroke", "#CDCDCD")
      .style("stroke-width", 2)
      .style("stroke-dasharray","2,2")
      .attr("x1", 0)
      .attr("y1", y_scale(sd_line_y_two))
      .attr("x2", w)
      .attr("y2", y_scale(sd_line_y_two))
  })
}

function add_y_label_dropdown(data) {

  let y_label_view = document.getElementById('y-label-dropdown')
  if (y_label_view.childElementCount > 0) {
    y_label_view.removeChild(y_label_view.childNodes[0])
  }
  
  // Add y-axis label
  let svg = d3.select('#frame-comparison-view')
  let y_label = svg
    .append('g')
    .attr('id', 'y-label')

  // Y-label dropdown
  let dropdown = new Dropdown(
    'y-label'
  )
  let dropdown_view = document.getElementById('y-label-dropdown')
  dropdown.gen_dropdown(y_line_chart['selected'])

  // Y-label dropdown items
  for (let item of y_line_chart['all']) {
    let item_text = item.replace(/-/g, ' ').replace(/_/g, ' ')
    if (!(item.includes('joint'))) {
      item_text = 'Angle change of ' + item_text
    }
    dropdown.add_dropdown_menu_item(
      item,
      item_text,
      {
        'mouseover': function() {  },
        'mouseout': function() {  },
        'click': function() {   
          
          // Megan, could you check if it works with 
          // 1) newly selected video, 
          // 2) weak eps, 
          // 3) strong eps?
          let data_item = data_dir
          let weak_eps = attack_strength['weak']
          let strong_eps = attack_strength['strong']

          // Avg joint displacement
          if (item.includes('joint')) {
            // This should be average joint displacement, 
            // we use each joint's value only in angles. 

            update_dist_plot(data_dir, item, weak_eps, strong_eps, 'displacement-average', null)

            // Update line chart

          } 
          // Joint angles
          else {
            update_dist_plot(data_dir, item, weak_eps, strong_eps, 'angle-change', null)
          }

          y_line_chart['selected'] = item
          draw_line_chart(
            data,
            y_line_chart['selected']
          )  
        }
      }
    )
  }

  dropdown_view.appendChild(dropdown.get_dropdown())
}



//////////////////////////////////////////////////////////////////
// Generate frame control board
//////////////////////////////////////////////////////////////////
export function gen_background_control(input_type) {

  // Add video option
  let video_option = add_option(
    input_type, 'frame', `${mk_1st_letter_capital(input_type)}ly Attacked Video Frame`, 
    function() { 
      if (frame_option[input_type]['background'] != 'video') {
        show_background_video_frame(input_type)
      }
    } 
  )
  // Add confidence distribution option
  let confidence_option = add_option(
    input_type, 'confidence', 'Confidence distribution', 
    function() { 
      if (frame_option[input_type]['background'] != 'confidence') {
        show_background_confidence_distribution(input_type)
      }
    } 
  )
  
  function add_option(input_type, option_id, option_text, click_function) {

    // Generate option g
    let option_g = d3.select(`#${input_type}-background-${option_id}`)
      .append('g')
      .attr('id', `option-${input_type}-${option_id}`)
      .style('display', 'block')
      .on('click', function() {

        let need_on = frame_option[input_type]['background'] != option_id

        if (need_on) {

          // Execute the click function
          click_function()

          // Hide all check icons
          d3.selectAll(`.${input_type}-option-check-icon`)
            .style('display', 'none')

          // Show other uncheck icons
          d3.selectAll(`.${input_type}-option-uncheck-icon`)
            .style('display', 'inline-block')

          // Show current option's check icon
          d3.select(`#${input_type}-option-${option_id}-uncheck-icon`)
            .style('display', 'none')
          d3.select(`#${input_type}-option-${option_id}-check-icon`)
            .style('display', 'inline-block')

          // Update frame background option
          frame_option[input_type]['background'] = option_id
        }
        
      })

    // Add check icon
    let need_check = frame_option[input_type]['background'] == option_id ? true : false
    let check_icon = option_g
      .append('i')
      .attr('id', `${input_type}-option-${option_id}-check-icon`)
      .attr('class', ['option-check-icon', `${input_type}-option-check-icon`, `${option_id}-check-icon`, icon_class['check']].join(' '))
      .style('cursor', 'pointer')
      .style('display', need_check ? 'inline-block' : 'none')
    
    // Add uncheck icon
    let uncheck_icon = option_g
      .append('i')
      .attr('id', `${input_type}-option-${option_id}-uncheck-icon`)
      .attr('class', ['option-uncheck-icon', `${input_type}-option-uncheck-icon`, `${option_id}-uncheck-icon`, icon_class['uncheck']].join(' '))
      .style('cursor', 'pointer')
      .style('display', need_check ? 'none' : 'inline-block')
      
    // Add text
    let text = option_g
      .append('text')
      .attr('id', `option-${option_id}-text`)
      .text(option_text)
      .style('display', 'inline-block')
      .style('padding-left', control_board_style['text-left-padding'] + 'px')
      .style('font-size', control_board_style['text-font-size'] + 'px')
      .style('transform', control_board_style['text-transform'])
  }

}

export function show_background_video_frame(input_type) {

  // Update thumbnail images
  d3.selectAll(`.${input_type}-thumbnail`)
    .attr('href', function() {
      let thumbnail_i = parseInt(d3.select(this).attr('id').split('-').slice(-1)[0])
      let frame_i = thumbnail_i * frame_info['num_subframes']
      return `${data_path[`${input_type}_frame_dir`]}/frame-${pad_number(frame_i, 3, 0)}.png`
    })

  // Update separate view frame
  d3.select(`#${input_type}-view-bg-img`)
    .attr('href', `${data_path[`${input_type}_frame_dir`]}/frame-${pad_number(frame_info['curr'], 3, 0)}.png`)

  // Update image mask 
  d3.select(`#${input_type}-view-bg-img-mask`).style('fill', 'white')
    
}

function show_background_confidence_distribution(input_type) {
  
  // Update thumbnail images
  d3.selectAll(`.${input_type}-thumbnail`)
    .attr('href', function() {
      let thumbnail_i = parseInt(d3.select(this).attr('id').split('-').slice(-1)[0])
      let frame_i = thumbnail_i * frame_info['num_subframes']
      return `${data_path[`${input_type}_confidence_dir`]}/frame-${pad_number(frame_i, 3, 0)}.png`
    })

  // Update separate view frame
  d3.select(`#${input_type}-view-bg-img`)
    .attr('href', `${data_path[`${input_type}_confidence_dir`]}/frame-${pad_number(frame_info['curr'], 3, 0)}.png`)

  // Update image mask 
  d3.select(`#${input_type}-view-bg-img-mask`).style('fill', 'transparent')
}

function show_perturbation_video_frame() {

  // Update thumbnail images
  d3.selectAll('.attacked-thumbnail')
    .attr('href', function() {
      let thumbnail_i = parseInt(d3.select(this).attr('id').split('-').slice(-1)[0])
      let frame_i = thumbnail_i * frame_info['num_subframes']
      return `${data_path['attacked_perturbation_dir']}/frame-${pad_number(frame_i, 3, 0)}.png`
    })

  // Update separate view frame
  d3.select('#attacked-view-bg-img')
    .attr('href', `${data_path['attacked_perturbation_dir']}/frame-${pad_number(frame_info['curr'], 3, 0)}.png`)

  // Update image mask 
  d3.select(`#attacked-view-bg-img-mask`).style('fill', 'transparent')
}


//////////////////////////////////////////////////////////////////
// Generate time view
//////////////////////////////////////////////////////////////////
export function gen_time_control_view(time_view) {

  // Generate time bar
  let time_bar = time_view.select('#time-bar')
  gen_time_slider(time_bar)

  // Generate time buttons
  let time_button = time_view.select('#time-button')
  gen_time_button(time_button)
}

function gen_time_slider(time_view) {

  // Generate g for time slider
  var time_g = time_view
    .append('g')
    .attr('id', 'time-bar-g')

  // Generate bar
  let bar = time_g
    .append('rect')
    .attr('id', 'time-bar-rect')
    .style('position', 'absolute')
    .style('background', time_style['slider-bar-color'])
    .style('width', frame_info['canvas-w'] + 'px')
    .style('height', time_style['slider-bar-height'] + 'px')
    .style('border-radius', time_style['slider-bar-border-radius'] + 'px')

  // Generate knob text
  let text = time_g
    .append('text')
    .text('Frame: 0')
    .attr('id', 'time-bar-knob-text')
    .style('position', 'absolute')
    .style('font-size', time_style['knob-font-size'] + 'px')
    .style('transform', function() {
      var x = time_style['knob-text-x']
      var y = time_style['knob-text-y']
      return 'translate(' + x + 'px,' + y + 'px)'
    })
    .style('color', '#999999')

  // Generate knob
  let knob = time_g
    .append('rect')
    .attr('id', 'time-bar-knob')
    .style('cursor', 'pointer')
    .style('position', 'absolute')
    .style('background', time_style['knob-color'])
    .style('width', time_style['knob-width'] + 'px')
    .style('height', time_style['knob-height'] + 'px')
    .style('border-radius', time_style['slider-knob-border-radius'] + 'px')
    .style('transform', function() {
      var y = time_style['knob-height'] / 2
      y = y - time_style['slider-bar-height'] / 2
      return 'translate(0px,-' + y + 'px)'
    })
    .call(
      d3.drag()
        .on('start', function() {})
        .on('drag', function() {

          // Move knob
          var x = d3.min([d3.max([0, d3.event.x]), frame_info['canvas-w']])
          d3.select(this)
            .style('transform', function() {
              var y = time_style['knob-height'] / 2
              y = y - time_style['slider-bar-height'] / 2
              return 'translate(' + x + 'px,-' + y + 'px)'
            })

          // Move value
          d3.select('#time-bar-knob-text')
            .style('transform', function() {
              var transform_x = time_style['knob-text-x'] + x
              var y = time_style['knob-text-y']
              return 'translate(' + transform_x + 'px,' + y + 'px)'
            })

          // New frame number
          var val_scale = d3.scaleLinear()
            .domain([0, frame_info['canvas-w']])
            .range([frame_info['min_frame'], frame_info['max_frame']])
          var val = round_off(val_scale(x), 1)

          if (val != frame_info['curr']) {
            frame_info['curr'] = val

            // Update frame value
            update_frame_number(x)

            // Draw the current frame
            draw_curr_frame()

            // Update skeleton
            update_curr_skeleton()
          }
          
          
        })
        .on('end', function() {
          move_knob()
        })
    )

}

function gen_time_button(time_button) {

  // time_button_div style
  time_button
    .style('width', frame_info['canvas-w'] + 'px')
    .style('text-align', 'center')
    .style('margin-top', time_style['button-margin-top'] + 'px')

  // Add buttons
  let button_width_padding = frame_info['canvas-w'] / 5
  let button_classes = ['fast-backward', 'step-backward', 'pause', 'play', 'step-forward', 'fast-forward']
  let click_functions = {
    'fast-backward': fast_backward_button_clicked,
    'step-backward': step_backward_button_clicked,
    'pause': pause_button_clicked,
    'play': play_button_clicked,
    'step-forward': step_forward_button_clicked,
    'fast-forward': fast_forward_button_clicked
  }
  button_classes.forEach(button_class => {

    let button_div = time_button
      .append('div')
      .attr('id', `${button_class}-button-div`)
      .on('click', click_functions[button_class])
      .style('display', function() {
        if (button_class == 'pause') {
          return 'none'
        } else {
          return 'inline-block'
        }
      })

    let button = button_div
      .append('i')
      .attr('id', `${button_class}-button`)
      .attr('class', icon_class[button_class])
      .style('cursor', 'pointer')
      .style('font-size', time_style['button-size'] + 'px')
      .style('width', button_width_padding + 'px')
      .style('color', time_style['slider-bar-color'])
      
  })

}

export function draw_curr_frame() {

  let dropdown = document.getElementById("overlap-data-dir-dropdown")

  // Update frame images
  let frame_id = pad_number(frame_info['curr'], 3, 0)
  let overlap_frame_filename = `${data_path['weak_frame_dir']}/frame-${frame_id}.png` 
  let weak_frame_filename = `${data_path[`weak_${frame_option['weak']['background']}_dir`]}/frame-${frame_id}.png`
  let strong_frame_filename = `${data_path[`strong_${frame_option['strong']['background']}_dir`]}/frame-${frame_id}.png`
  d3.select('#overlap-view-bg-img')
    .attr('href', overlap_frame_filename)
  d3.select('#weak-view-bg-img')
    .attr('href', weak_frame_filename)
  d3.select('#strong-view-bg-img')
    .attr('href', strong_frame_filename)

  // Highlight the corresponding thumbnail
  let thumbnail_number = frame_info['thumbnail_number']
  d3.selectAll('.thumbnail-border')
    .style('stroke-width', frame_style['default']['stroke-width'] + 'px')
    .style('stroke', color_dict['bg-img-border'])
  d3.select(`#weak-thumbnail-border-${thumbnail_number}`)
    .style('stroke-width', frame_style['weak']['stroke-width'] + 'px')
    .style('stroke', color_dict['weak'])
  d3.select(`#strong-thumbnail-border-${thumbnail_number}`)
    .style('stroke-width', frame_style['strong']['stroke-width'] + 'px')
    .style('stroke', color_dict['strong'])

  // Highlight the plot background
  d3.select('#highlight-bg')
    .style('transform', `translate(${thumbnail_number * bg_img_style['frame']['width']}px, 0px)`)

}

function update_frame_number(x) {

  // Current frame
  let val = frame_info['curr']

  // Update frame number in silder
  d3.select('#time-bar-knob-text')
    .text(`Frame: ${val}`)
  
  // Update frame value in overlap view
  d3.select('#overlap-frame-number-text')
    .text(`Frame: ${val}`)

  // Update frame value in separate view - one frame
  d3.select('#skeleton-one-frame-text')
    .text(`Skeleton for frame ${val}`)

  // Update frame value in separate view - frame range
  let thumbnail_number = parseInt(frame_info['curr'] / frame_info['num_subframes'])
  frame_info['thumbnail_number'] = thumbnail_number
  let start_frame = thumbnail_number * frame_info['num_subframes']
  let end_frame = start_frame + frame_info['num_subframes'] - 1
  d3.select('#skeleton-frame-range-text')
    .text(`Skeleton for frame ${start_frame}-${end_frame}`)  

  // Update frame line
  d3.select('#frame-line')
    .attr('x1', x)
    .attr('x2', x)
}

function move_knob() {
  
  // Frame value
  var val = frame_info['curr']

  // X scale
  var x_scale = d3.scaleLinear()
    .domain([frame_info['min_frame'], frame_info['max_frame']])
    .range([0, frame_info['canvas-w']])

  // Update x
  var x = x_scale(val)

  // Move knob
  d3.select('#time-bar-knob')
    .style('transform', function() {
      var y = time_style['knob-height'] / 2
      y = y - time_style['slider-bar-height'] / 2
      return 'translate(' + x + 'px,-' + y + 'px)'
    })

  // Move val
  d3.select('#time-bar-knob-text')
    .text(`Frame: ${val}`)
    .style('transform', function() {
      var transform_x = time_style['knob-text-x'] + x
      var y = time_style['knob-text-y']
      return 'translate(' + transform_x + 'px,' + y + 'px)'
    })
    .style('color', '#999999')

  update_frame_number(x)
}

function play_button_clicked() {

  // Update the play status
  frame_info['is_playing'] = true

  // Show pause icon and hide play icon
  d3.select('#pause-button-div').style('display', 'inline-block')
  d3.select('#play-button-div').style('display', 'none')

  // Draw the next frame with delay
  let t = d3.interval(elapsed => {

    // Next frame
    frame_info['curr'] += 1

    // Stop the timer if user clicks pause, or it has reached the end of data
    if (!frame_info['is_playing'] || (frame_info['curr'] >= frame_info['max_frame'])) {
      frame_info['is_playing'] = false
      t.stop()
      if (frame_info['curr'] > frame_info['max_frame']) {
        pause_button_clicked()
        frame_info['curr'] = frame_info['max_frame']
      }
    } else {
      move_knob()
      update_curr_skeleton()
      draw_curr_frame()
    }
  }, 100);
}

function pause_button_clicked() {

  // Update the play status
  frame_info['is_playing'] = false

  // Hide pause icon and show play icon
  d3.select('#pause-button-div').style('display', 'none')
  d3.select('#play-button-div').style('display', 'inline-block')

}

function step_forward_button_clicked() {
  pause_button_clicked()
  frame_info['curr'] += 1
  frame_info['curr'] = d3.min([frame_info['curr'], frame_info['max_frame'] - 1])
  move_knob()
  draw_curr_frame()
  update_curr_skeleton()
}

function step_backward_button_clicked() {
  pause_button_clicked()
  frame_info['curr'] -= 1
  frame_info['curr'] = d3.max([frame_info['curr'], frame_info['min_frame']])
  move_knob()
  draw_curr_frame()
  update_curr_skeleton()
}

function fast_forward_button_clicked() {
  frame_info['curr'] = frame_info['max_frame'] - 1
  move_knob()
  draw_curr_frame()
  update_curr_skeleton()
  pause_button_clicked()
}

function fast_backward_button_clicked() {
  frame_info['curr'] = frame_info['min_frame'] 
  move_knob()
  update_curr_skeleton()
  pause_button_clicked()
  draw_curr_frame()
}


//////////////////////////////////////////////////////////////////
// Generate skeleton
//////////////////////////////////////////////////////////////////v

export function gen_skeleton() {

  Promise.all([
    d3.csv(`${data_path['weak_skeleton_filepath']}`),
    d3.csv(`${data_path['strong_skeleton_filepath']}`),
  ]).then(function(files) {

    // Save data
    skeleton_data['weak'] = files[0].slice(0, 100)
    skeleton_data['strong'] = files[1].slice(0, 100)

    // Draw the skeleton
    update_curr_skeleton()
    
  }).catch(function(err) {
    console.log('ERROR:', err)
  })

}

export function update_curr_skeleton() {

  // Draw skeleton in overlap view
  let skeleton_g = d3.select('#overlap-view-skeleton')
  let coeff = bg_img_style['overlap']['width'] / bg_img_style['original']['width']
  draw_skeleton('weak', skeleton_g, coeff, false)
  draw_skeleton('strong', skeleton_g, coeff, false, true)
  
  // Draw skeleton in separate view
  let cumulate = separate_view_skeleton['frame'] == 'range' ? true : false
  let start_frame = frame_info['thumbnail_number'] * frame_info['num_subframes']
  let weak_g = d3.select('#weak-view-skeleton')
  let strong_g = d3.select('#strong-view-skeleton')
  let coeff2 = bg_img_style['separate']['width'] / bg_img_style['original']['width']
  console.log(cumulate)
  if (!cumulate || (frame_info['curr'] != start_frame)) {
    draw_skeleton('weak', weak_g, coeff2, cumulate)
    draw_skeleton('strong', strong_g, coeff2, cumulate)
  }

}

export function draw_skeleton(input_type, g, coeff, cumulate, dont_remove) {
  console.log(cumulate);
  // XXXXXXXXXXXXXXXXXXXXXX
  let [m, M] = [0, 2.09]
  let r_scale = d3.scaleLinear()
    .domain([m, M])
    .range([2, 8])
 
  // Remove previous skeleton
  if (!dont_remove) {
    g.selectAll('*').remove()
  }

  // Frames to add skeleton
  let frames = [frame_info['curr']]
  if (cumulate) {
    let start_frame = frame_info['thumbnail_number'] * frame_info['num_subframes']
    frames = [...Array(frame_info['num_subframes']).keys()].map(x => x + start_frame)
  }

  // Add skeleton and keypoins for all frame
  let base_opacity = 0.1
  // let opacity_coeff = (frames.length == 1) ? 1 : 0.3
  let opacity_coeff = (1 - base_opacity) ** 2 / frames.length
  let threshold = 0
  frames.forEach((frame, i) => {

    // Update skeleton line for each frame
    skeletons.forEach(s => {
      let sx = +skeleton_data[input_type][frame][`p0_${keypoints[s[0] - 1]}_x`] * coeff
      let sy = +skeleton_data[input_type][frame][`p0_${keypoints[s[0] - 1]}_y`] * coeff
      let tx = +skeleton_data[input_type][frame][`p0_${keypoints[s[1] - 1]}_x`] * coeff
      let ty = +skeleton_data[input_type][frame][`p0_${keypoints[s[1] - 1]}_y`] * coeff

      // TODO: Remove this thresholding later
      let curC1 = r_scale(+skeleton_data[input_type][frame][`p0_${keypoints[s[0] - 1]}_c`] * coeff)
      let curC2 = r_scale(+skeleton_data[input_type][frame][`p0_${keypoints[s[1] - 1]}_c`] * coeff)

      if ((curC1 > threshold) && (curC2 > threshold)) {
        if (sx !== 0 && sy !== 0 && tx !== 0 && ty !== 0) {
          g.append('line')
            .attr('x1', sx)
            .attr('y1', sy)
            .attr('x2', tx)
            .attr('y2', ty)
            .style('stroke', color_dict[input_type])
            .style('opacity', base_opacity + opacity_coeff * (i + 1))
            // .style('opacity', opacity_coeff)
        }
      }
  
      
    })

    // Update keypoints for each frame
    keypoints.forEach(k => {

      // Draw the keypoint
      let curX = +skeleton_data[input_type][frame][`p0_${k}_x`] * coeff
      let curY = +skeleton_data[input_type][frame][`p0_${k}_y`] * coeff
      let curC = +skeleton_data[input_type][frame][`p0_${k}_c`] * coeff
      if (curX !== 0 && curY !== 0) {
        g.append('circle')
          .attr('cx', curX)
          .attr('cy', curY)
          .attr('r', function(d) { 
            if (r_scale(curC) > threshold)
              return r_scale(curC) 
          })
          .style('fill', color_dict[input_type])
          .style('opacity', base_opacity + opacity_coeff * (i + 1))
          // .style('opacity', opacity_coeff)
          .style('stroke', 'white')
          .style('stroke-opacity', 0.2)
      }
    })
  })
  
}