import { Locations as AllLocations } from "../apps/support/locations";

type LocationsKeys = keyof AllLocations;
type GettableLocations = AllLocations[LocationsKeys];
type GettableLocationKeys = keyof AllLocations[keyof AllLocations];

type LocationData<T extends GettableLocationKeys> = {
  [key in T]: AllLocations[keyof AllLocations][T];
};

export type Response<K extends GettableLocationKeys> = LocationData<K> & {
  errors: {};
};

export type ClientGet<
  K extends keyof GettableLocations = keyof GettableLocations
> = (getter: K) => Promise<Response<K>>;