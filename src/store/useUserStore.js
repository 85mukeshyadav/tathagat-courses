import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useUserStore = create(
	persist(
		(set) => ({
			user: {
				name: "",
				email: "",
				mobile: "",
				address: "",
				profile: "",
			},
			setUser: (user) => {
				set({ user });
			},
		}),
		{
			name: "user-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useUserStore;
