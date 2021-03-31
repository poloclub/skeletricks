
// Global variables
export var frame_info = {
  'total_frames': 100,
  'num_thumbnails': -1,
  'num_subframes': -1,
  'curr': 0,
  'thumbnail_number': 0,
  'canvas-w': 0,
  'min_frame': 0,
  'max_frame': -1,
  'is_playing': false
}

export var frame_option = {
  'weak': {
    'background': 'frame', // ['frame', 'confidence'] 
    'skeleton': {
      'onoff': 'on', // ['on', 'off']
      'color': 'importance', // ['off', 'importance']
      'size': 'importance', // ['off', 'importance']
      'label': 'on'
    }
  },
  'strong': {
    'background': 'frame', // ['frame', 'perturbation', 'confidence'] 
    'skeleton': {
      'onoff': 'on', // ['on', 'off']
      'color': 'importance', // ['off', 'importance']
      'size': 'importance', // ['off', 'importance']
      'label': 'on'
    }
  }
}

export var selected_keypoints = []

export var plot_value = {

  'selected': {
    // 'benign_softmax_weightlifting': true, 
    // 'attacked_softmax_weightlifting': true
    'weak_avg_delta': true,
    'strong_avg_delta': true
  },
  'all': [
    // 'benign_softmax_weightlifting', 
    // 'attacked_softmax_weightlifting'
    'weak_avg_delta',
    'strong_avg_delta'
  ],
  'color': {
    // 'benign_softmax_weightlifting': '#33BB33',
    // 'attacked_softmax_weightlifting': '#FF8800'
    // 'weak_avg_delta': '#33BB33',
    // 'strong_avg_delta': '#FF8800'
    'weak_avg_delta': '#AD63FC',
    'strong_avg_delta': '#F58E14'
  }
}

export var separate_view_skeleton = {
  'frame': 'one' // ['one', 'range']
}

export var skeleton_data = {
  'weak': {},
  'strong': {}
}



// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// GLOBAL VARIABLE
// item-00000 ~ item-00100
var data_dir = 'item-00018'
function set_data_dir(val) {
  data_dir = val
}

export {data_dir, set_data_dir}

let week_std_dev = 0
function set_week_std_dev(val) {
  week_std_dev = val
}

let week_avg = 0
function set_week_avg(val) {
  week_avg = val
}

export {week_std_dev, set_week_std_dev}
export {week_avg, set_week_avg}


var attack_strength = {
  'weak': 0,
  'strong': 8
}

var attack_type = "patch"
function set_attack_type(val) {
  attack_type = val
}
export {attack_type, set_attack_type}


function update_attack_strength(type, val) {
  if (type == "weak") {
    attack_strength.weak = val
  }
  else if (type == "strong") {
    attack_strength.strong = val
  }
}

export {attack_strength, update_attack_strength}

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// GLOBAL VARIABLE

var skelFile, displacementFile, angleFile, frame_dir;
var attack_weak, attack_strong;
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

var attack_type_use = "pgd";
if (attack_type == "patch") {
  attack_type_use = "patch10pgd"
}


if (attack_strength.weak == 0) {
  skelFile = `${attack_type}_interpolated_data/${data_dir}/keypoints-benign.csv`;
  displacementFile = `${attack_type}_interpolated_data/${data_dir}/displacements-benign.csv`;
  angleFile = `${attack_type}_interpolated_data/${data_dir}/angle-changes-benign.csv`;
  frame_dir = `${attack_type}_interpolated_data/${data_dir}/clips-benign`
} else {
  skelFile = `${attack_type}_interpolated_data/${data_dir}/keypoints-attack-${attack_type_use}${attack_weak}.csv`;
  displacementFile = `${attack_type}_interpolated_data/${data_dir}/displacements-attack-${attack_type_use}${attack_weak}.csv`;
  angleFile = `${attack_type}_interpolated_data/${data_dir}/angle-changes-attack-${attack_type_use}${attack_weak}.csv`;
  frame_dir = `${attack_type}_interpolated_data/${data_dir}/clips-attack-${attack_type_use}${attack_weak}`;
}

var data_path = {
  'data_dir': `${attack_type}_interpolated_data`,
  'class_labels': `${attack_type}_interpolated_data/${data_dir}/class_labels.json`, 
  'benign_frame_dir': `${attack_type}_interpolated_data/${data_dir}/clips-benign`, 
  'weak_frame_dir': frame_dir, 
  'strong_frame_dir': `${attack_type}_interpolated_data/${data_dir}/clips-attack-${attack_type_use}${attack_strong}`,
  'weak_confidence_dir': `${attack_type}_interpolated_data/${data_dir}/confidence-lunges-benign`,
  'strong_confidence_dir': `${attack_type}_interpolated_data/${data_dir}/confidence-lunges-adversarial`,
  'weak_perturbation_dir': `${attack_type}_interpolated_data/${data_dir}/clip-lunges-perturbation`,  
  'weak_skeleton_filepath': skelFile,
  'strong_skeleton_filepath': `${attack_type}_interpolated_data/${data_dir}/keypoints-attack-${attack_type_use}${attack_strong}.csv`,
  'weak_displacement_filepath': displacementFile,
  'strong_displacement_filepath': `${attack_type}_interpolated_data/${data_dir}/displacements-attack-${attack_type_use}${attack_strong}.csv`,
  'weak_angle_filepath': angleFile, // TODO: Update filename with attack strength
  'strong_angle_filepath': `${attack_type}_interpolated_data/${data_dir}/angle-changes-attack-${attack_type_use}${attack_strong}.csv`
}

export var y_line_chart = {
  'selected': 'Avg-joint-displacement',
  'all': [
    'Avg-joint-displacement',
    'left_shoulder',
    'right_shoulder',
    'left_elbow',
    'right_elbow',
    'left_hip',
    'right_hip',
    'left_knee',
    'right_knee'
  ]
}
function update_data_path() {
  var skelFile, displacementFile, angleFile, frame_dir;
  var attack_weak, attack_strong;
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

  var attack_type_use = "pgd";
  if (attack_type == "patch") {
    attack_type_use = "patch10pgd"
  }


  if (attack_strength.weak == 0) {
    skelFile = `${attack_type}_interpolated_data/${data_dir}/keypoints-benign.csv`;
    displacementFile = `${attack_type}_interpolated_data/${data_dir}/displacements-benign.csv`;
    angleFile = `${attack_type}_interpolated_data/${data_dir}/angle-changes-benign.csv`;
    frame_dir = `${attack_type}_interpolated_data/${data_dir}/clips-benign`
  } else {
    skelFile = `${attack_type}_interpolated_data/${data_dir}/keypoints-attack-${attack_type_use}${attack_weak}.csv`;
    displacementFile = `${attack_type}_interpolated_data/${data_dir}/displacements-attack-${attack_type_use}${attack_weak}.csv`;
    angleFile = `${attack_type}_interpolated_data/${data_dir}/angle-changes-attack-${attack_type_use}${attack_weak}.csv`;
    frame_dir = `${attack_type}_interpolated_data/${data_dir}/clips-attack-${attack_type_use}${attack_weak}`;
  }

  data_path = {
    'data_dir': `${attack_type}_interpolated_data`,
    'class_labels': `${attack_type}_interpolated_data/${data_dir}/class_labels.json`, 
    'benign_frame_dir': `${attack_type}_interpolated_data/${data_dir}/clips-benign`, 
    'weak_frame_dir': frame_dir, 
    'strong_frame_dir': `${attack_type}_interpolated_data/${data_dir}/clips-attack-${attack_type_use}${attack_strong}`,
    'weak_confidence_dir': `${attack_type}_interpolated_data/${data_dir}/confidence-lunges-benign`,
    'strong_confidence_dir': `${attack_type}_interpolated_data/${data_dir}/confidence-lunges-adversarial`,
    'weak_perturbation_dir': `${attack_type}_interpolated_data/${data_dir}/clip-lunges-perturbation`,  
    'weak_skeleton_filepath': skelFile,
    'strong_skeleton_filepath': `${attack_type}_interpolated_data/${data_dir}/keypoints-attack-${attack_type_use}${attack_strong}.csv`,
    'weak_displacement_filepath': displacementFile,
    'strong_displacement_filepath': `${attack_type}_interpolated_data/${data_dir}/displacements-attack-${attack_type_use}${attack_strong}.csv`,
    'weak_angle_filepath': angleFile, // TODO: Update filename with attack strength
    'strong_angle_filepath': `${attack_type}_interpolated_data/${data_dir}/angle-changes-attack-${attack_type_use}${attack_strong}.csv`
  }
}

export {data_path, update_data_path}
