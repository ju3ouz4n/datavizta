import type { Cloud, Server, UserDevice } from "./types/hardware";
import type { Impacts } from "./types/impact";
import { cacheFetch, sha256, hasCache } from "$lib/cache";
let base;
if (import.meta.env.VITE_PUBLIC_API_URL) {
  base = import.meta.env.VITE_PUBLIC_API_URL;
} else {
  base = "https://api.boavizta.org/v1";
}

class boaviztaClient {
  static #instance: boaviztaClient;
  private fetchFromPage;

  private constructor() { }

  public static get instance(): boaviztaClient {
      if (!boaviztaClient.#instance) {
          boaviztaClient.#instance = new boaviztaClient();
      }

      return boaviztaClient.#instance;
  }

  public setFetchMethod(svKitFetch){
    if(svKitFetch !== undefined){
      this.fetchFromPage = svKitFetch
    }
  }

  public async send(
  method: string,
  path: string,
  data: unknown = undefined
) {
  const opts: RequestInit = { method, headers: {} };
  opts.method = method;
  opts.headers = {
    "Content-Type": "application/json",
  };
  let cacheKey = `${path}_` + method;
  //Compute cachekey only if needed
  if (method != "GET" && hasCache()) {
    opts.body = JSON.stringify(data);

    cacheKey += "_" + (await sha256(opts.body));
  }
  let fetchMethod;
  /* use sveltkit fetch when possible*/
  if( this.fetchFromPage )
    fetchMethod = this.fetchFromPage
  else 
    fetchMethod = fetch 

  const res = await cacheFetch(cacheKey, () =>
    fetchMethod(`${base}/${path}`, opts)
  );
  if (!res) throw new Error(res["detail"]);
  return res;
}

public async get(path: string) {
  return this.send("GET", path);
}



public async post(path: string, data) {
  return this.send("POST", path, data);
}



public async getServerImpact(server: Server): Promise<Impacts> {
  const params = "?verbose=true";
  const res = await this.post("server/" + params, {
    model: server.model,
    configuration: server.config,
    usage: server.usage,
  });

  return res;
}

public async getCloudImpact(instance: Cloud): Promise<Impacts> {
  const params = "?verbose=true&criteria=gwp&criteria=pe&criteria=adp";
  const res = await this.post("cloud/instance" + params, instance);
  return res;
}

public async  getUserDeviceImpact(
  device: UserDevice,
  yearly: Boolean = false
): Promise<Impacts> {
  let res;
  if (yearly) {
    res = await this.post(
      device.category +
        "/" +
        device.subcategory +
        "?criteria=gwp&criteria=ir&criteria=pe&criteria=adpe&criteria=odp&criteria=ap&criteria=ept" +
        "&duration=8760&archetype=" +
        device.archetype,
      device
    );
  } else {
    res = await this.post(
      device.category +
        "/" +
        device.subcategory +
        "?criteria=gwp&criteria=ir&criteria=pe&criteria=adpe&criteria=odp&criteria=ap&criteria=ept" +
        "&archetype=" +
        device.archetype,
      device
    );
  }
  return res;
}

public async  getitems(route) {
  return this.get(route)
    .then((data) => {
      let elements = [];
      for (let i = 0; i < data.length; i++) {
        elements.push({ value: data[i], label: data[i] });
      }
      return elements;
    });
}

public async  getAllInstances(cloud_provider) {
  let cloud_instances_route = "cloud/instance/all_instances";
  return this.get(cloud_instances_route + "?provider=" + cloud_provider)
    .then((data) => {
      let elements = [];
      for (let i = 0; i < data.length; i++) {
        elements.push({ value: data[i], label: data[i] });
      }
      return elements;
    });
}

public getExtendLifetimeAvoid(
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
    public async getlocalisation(route) {
      return this.get(route).then((data) => {
        let elements = [];
        let items = Object.keys(data);
        for (let i = 0; i < items.length; i++) {
          elements.push({ value: data[items[i]], label: items[i] });
        }
        return elements;
      });
    }

    public async getArchetypes(category, subcategory) {
      return this.get(category + "/" + subcategory + "/archetypes")
        .then((data) => {
          let elements = [];
          for (let i = 0; i < data.length; i++) {
            elements.push({ value: data[i], label: data[i] });
          }
          return elements;
        });
    }

    public async getUsageDefaultValues(category, subcategory, archetype) {
      return this.get(
        category +
          "/" +
          subcategory +
          "/archetype_config?archetype=" +
          archetype
      );
    }
    public async getDeviceTypes(category) {
      return this.get(category + "/all");
    }

public async loadAndFormatCloudImpacts(cloud_instance, verboseImpactsSkeleton) {

    let serverImpact = await this.getCloudImpact(cloud_instance);
    let computeImpacts = { ...verboseImpactsSkeleton };
    computeImpacts = this.mapImpactsFromApi(computeImpacts,serverImpact)
    return computeImpacts;
  }
    
  public mapImpactsFromApi(locaDatas, apiDatas){
    const assessedImpacts:Array<string> = ["adp","gwp","pe"]
    const expectedComponentLabels = [
      "cpu",
      "ram",
      "motherboard",
      "power_supply",
      "assembly",
      "case",
      "ssd",
      "hdd"
    ];
    const apiComponentLabels = [
      "CPU-1",
      "RAM-1",
      "MOTHERBOARD-1",
      "POWER_SUPPLY-1",
      "ASSEMBLY-1",
      "CASE-1",
      "SSD-1",
      "HDD-1",
    ];

    assessedImpacts.forEach(function (itemImpact) {
        locaDatas[itemImpact]["unit"] = apiDatas.impacts[itemImpact]["unit"];
        locaDatas[itemImpact]["use"]["total"] =
          apiDatas.impacts[itemImpact]["use"]["value"];
        expectedComponentLabels.forEach(function (itemComp, indexComp){
          //Maps property names, E.g CPU-1 => cpu ...
            const apiComponentLabel = apiComponentLabels[indexComp]
            if (apiDatas.verbose[apiComponentLabel] !== undefined){
              locaDatas[itemImpact]["embedded"][itemComp] =
                apiDatas.verbose[apiComponentLabel]["impacts"][itemImpact][
                  "embedded"
                ]["value"];
            }
        })
    });
    return locaDatas;
  }

}


const singleton =  boaviztaClient.instance
export default singleton