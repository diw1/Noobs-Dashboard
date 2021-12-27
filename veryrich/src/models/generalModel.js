export function GeneralModel(model = {}) {
    const { reducers, initialState } = model
    model.reducers = {
        resetState: () => initialState,
        save(state, data) {
            return {
                ...state,
                ...data
            }
        },
        ...reducers
    }
    return model
}
