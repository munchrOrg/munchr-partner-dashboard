export type Cuisine = {
  id: string;
  name: string;
};

export type CuisinesResponse = Cuisine[] | { data: Cuisine[] };
