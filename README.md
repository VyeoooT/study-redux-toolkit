### Redux toolkit study
---

1. Folder **old_redux**: code theo kieu ```createReducer```; ```createAction```; ```builder callback```.

2. Folder **redux**: code theo kieu ```createSlice```: la su ket hop giua ```createReducer``` vs ```createAction```.

    * reducers: Khi muon generate action (khong can tao/khai bao action truoc khi code).
    * extraReducers: van su dung ```builder callback``` cho typeScript.
        * khong generate action.
        * ```addMatcher```, ```addDefaultCase```.
        * Khi dung voi ```createAsyncThunk```.

3. Folder **redux_api**: createSlice + createAsyncThunk ket hop tuong tac voi REST API
    * Xu ly goi API 1 lan
    * Axios
    * json-server local
    * Xu ly action trong ```extraReducers```
    * Xu ly ```skeleton loading```