interface IUserEdit {
    firstname: string,
    lastname: string,
    phone: string,
    roldId: number
}
export const useEditUserStore = defineStore("editUserStore", () => {

    const editUser = ref<IUserEdit>({ firstname: "", lastname: "", phone: "", roldId: 0 });
    const getEditUser = computed(() => editUser);
    const setEditUser = (data: IUserEdit) => {
        if (editUser.value) {
            editUser.value.firstname = data.firstname || "";
            editUser.value.lastname = data.lastname || "";
            editUser.value.phone = data.phone || "";
            editUser.value.roldId = data.roldId || 0;
        }
    }

    return { editUser, getEditUser, setEditUser };
});
