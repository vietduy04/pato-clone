import { create } from 'zustand'

const useStore = create((set, get) => ({
  restaurants: [],
  locations: [],
  loaded: false,
  loading: false,

  load: async () => {
    if (get().loaded || get().loading) return
    set({ loading: true })
    const [restRes, locRes] = await Promise.all([
      fetch('/data/all_restaurants.json'),
      fetch('/data/locations.json'),
    ])
    const [restaurants, locations] = await Promise.all([
      restRes.json(),
      locRes.json(),
    ])
    set({ restaurants, locations, loaded: true, loading: false })
  },
}))

export default useStore
