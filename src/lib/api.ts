import type { Cloud, Server, UserDevice } from "./types/hardware";
import type { Impacts } from "./types/impact";
let base
if (import.meta.env.VITE_PUBLIC_API_URL) {
  base = import.meta.env.VITE_PUBLIC_API_URL
} else {
  base = "https://api.boavizta.org/v1"
}

async function send(method: string, path: string, data: unknown = undefined) {
  const opts: RequestInit = { method, headers: {} };
  opts.method = method;
  opts.headers = {
    "Content-Type": "application/json",
  };
  if (method != "GET") {
    opts.body = JSON.stringify(data);
  }
  const res = await fetch(`${base}/${path}`, opts);
  if (!res.ok) throw new Error((await res.json())["detail"]);
  return res;
}

export async function get(path: string) {
  return send("GET", path);
}

export async function post(path: string, data) {
  return send("POST", path, data);
}

export async function getServerImpact(server: Server): Promise<Impacts> {
  const params = "?verbose=true";
  const res = await post("server/" + params, {
    model: server.model,
    configuration: server.config,
    usage: server.usage,
  });
  return res.text().then((json) => {
    return JSON.parse(json);
  });
}

export async function getCloudImpact(instance: Cloud): Promise<Impacts> {
  const params = "?verbose=true&criteria=gwp&criteria=pe&criteria=adp";
  const res = await post("cloud/instance" + params, instance);
  return res.text().then((json) => {
    return JSON.parse(json);
  });
}

export async function getUserDeviceImpact(device: UserDevice, yearly: Boolean = false): Promise<Impacts> {
  let res
  if (yearly) {
    res = await post(device.category + "/" + device.subcategory + "?criteria=gwp&criteria=ir&criteria=pe&criteria=adpe&criteria=odp&criteria=ap&criteria=ept" + "&duration=8760&archetype=" + device.archetype, device);
  } else {
    res = await post(device.category + "/" + device.subcategory + "?criteria=gwp&criteria=ir&criteria=pe&criteria=adpe&criteria=odp&criteria=ap&criteria=ept" + "&archetype=" + device.archetype, device);
  }
  return res.text().then((json) => {
    return JSON.parse(json);
  });
}


 export async function getitems(route) {
   return get(route)
     .then((response) => response.json())
     .then((data) => {
       let elements = [];
       for (let i = 0; i < data.length; i++) {
         elements.push({ value: data[i], label: data[i] });
       }
       return elements;
     });
 }

    export async function getAllInstances(cloud_provider) {
      let cloud_instances_route = "cloud/instance/all_instances";
      return get(cloud_instances_route + "?provider=" + cloud_provider)
        .then((response) => response.json())
        .then((data) => {
          let elements = [];
          for (let i = 0; i < data.length; i++) {
            elements.push({ value: data[i], label: data[i] });
          }
          return elements;
        });
    }

export function getExtendLifetimeAvoid(
  lifetime: Number,
  extendlifetime: Number,
  impact: Impacts,
  yearly
) {
  let output = {};
  if (extendlifetime == 0) {
    Object.keys(impact.impacts).forEach(function (key) {
      output[key] = { value: 0, unit: impact.impacts[key].unit };
    });
  } else {
    Object.keys(impact.impacts).forEach(function (key) {
      let embedded = impact.impacts[key].embedded.value;
      if (yearly == true) {
        embedded = lifetime * embedded;
      }
      let avoided = (embedded * extendlifetime) / lifetime;
      if (yearly == true) {
        avoided = avoided / extendlifetime;
      }
      output[key] = {
        value: avoided,
        unit: impact.impacts[key].unit,
      };
    });
  }
  return output;
}