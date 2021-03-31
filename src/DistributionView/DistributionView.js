import { create, all } from 'mathjs'
import * as d3 from 'd3';

let layout = {
    autosize: false,
    width: 120,
    height: 187,
    xaxis: {
      showticklabels: false,
      fixedrange: true,
    },
    yaxis: {
      showticklabels: false,
      fixedrange: true,
    },
    margin: {
      l: 0,
      r: 0,
      b: 20,
      t: 0,
      pad: 0
    },
    barmode: 'overlay',
    showlegend: false,
    font: {
        size: 9,
      }
  }

export {layout}

// With add-one smoothing (Laplace Smoothing)
export function jsdivergence(distOne, distTwo) {
    const config = { }
    const math = create(all, config)
    distOne = distOne.map((e) => e+1)
    distTwo = distTwo.map((e) => e+1)
    let distOne_sum = distOne.reduce(function(a, b){
        return a + b;
    }, 0);
    let distTwo_sum = distTwo.reduce(function(a, b){
        return a + b;
    }, 0);
    let p = distOne.map((e) => e/distOne_sum)
    let q = distTwo.map((e) => e/distTwo_sum)
    let m = p.map((e,i) => 0.5 *(e + q[i]))
    let kl_pm = math.kldivergence(p, m)
    let kl_qm = math.kldivergence(q, m)
    return (0.5*kl_pm + 0.5*kl_qm).toFixed(2)
}

export function epsToString(num) {
    if (num == 0.8) {
      return "008"
    }
    if (num >= 1 && num < 10) {
      return "00" + ~~num
    } else if (num >= 10 && num < 100) {
      return "0" + ~~num
    } else if (num >= 100 && num < 1000) {
      return "" + ~~num
    } else {
      throw "Invalid eps: "
    }
  }

export async function get_dist_data(file_path, joint) {
    let curr_x = []
    await d3.csv(file_path, function(curr_data) { 
      if (curr_data.Joints == joint) {
        for (let i = 0; i < 10; i++) {
          curr_x.push(parseInt(curr_data[i]))
        }
      }
    })
    return curr_x
  }

export async function get_val_data(file_path, joint) {
    let curr_y = []
    if (joint == "Avg-joint-displacement") {
      await d3.csv(file_path, function(curr_data) {
        curr_y.push(parseFloat(curr_data.average == "" ? 0 : curr_data.average))
      })
    } else {
      await d3.csv(file_path, function(curr_data) {
        curr_y.push(parseFloat(curr_data[joint] == "" ? 0 : curr_data[joint]))
      })
    }
    return curr_y
  }

export function get_file_name(eps, var_type) {
    let fileName = ""
    if (var_type == "displacement") {
      fileName += "displacements-"
    } else if (var_type == "angle") {
      fileName += "angle-"
    } else if (var_type == "angle-change") {
      fileName += "angle-change-"
    }
    else {
      throw var_type + " is not a valid var_type!"
    }

    if (eps == 0) {
      fileName += "benign-"
    } else {
      fileName += "attacked-"
    }

    fileName += "distribution.csv"
    return fileName
  }

export function get_val_file_name(eps, var_type, attack_type) {
    let fileName = ""
    if (var_type == "displacement") {
      if (eps == 0) {
        fileName = "displacements-benign.csv"
      } else {
        fileName = "displacements-attacked-eps_001.csv"
      }
    } else if (var_type == "angle") {
      if (eps == 0) {
        fileName = "keypoints-benign-angle.csv"
      } else {
        fileName = "keypoints-attacked-angle.csv"
      }
    } else if (var_type == "angle-change") {
      if (eps == 0) {
        fileName = "angle-changes-benign.csv"
      } else {
        if (attack_type == "patch" || attack_type == "Patch") {
          fileName = "angle-changes-attack-patch10pgd" + epsToString(eps) + ".csv"
        } else if (attack_type == "pgd" || attack_type == "PGD"){
          fileName = "angle-changes-attack-pgd" + epsToString(eps) + ".csv"
        } else {
          throw "Invalid attack type: " + attack_type
        }
        
      }
    } else if (var_type == "displacement-average") {
      if (eps == 0) {
        fileName = "average-benign.csv"
      } else {
        if (attack_type == "patch" || attack_type == "Patch") {
          fileName = "average-attack-patch10pgd" + epsToString(eps) + ".csv"
        } else if (attack_type == "pgd" || attack_type == "PGD"){
          fileName = "average-attack-pgd" + epsToString(eps) + ".csv"
        } else {
          throw "Invalid attack type: " + attack_type
        }
      }
    }
    else {
      throw var_type + " is not a valid var_type!"
    }
    return fileName
  } 