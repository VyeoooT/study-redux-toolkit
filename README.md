### Redux toolkit study
---

1. Folder **old_redux**: code theo kieu ```createReducer```; ```createAction```; ```builder callback```.
2. Folder **redux**: code theo kieu ```createSlice```: la su ket hop giua ```createReducer``` vs ```createAction```.
    * reducers: Khi muon generate action (khong can tao/khai bao action truoc khi code).
    * extraReducers: van su dung ```builder callback``` cho typeScript.
        * khong generate action.
        * ```addMatcher```, ```addDefaultCase```.
        * Khi dung voi ```createAsyncThunk```.