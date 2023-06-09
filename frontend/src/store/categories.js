import { CATEGORIES_GET } from '../api';
import createAsyncSlice from './helper/createAsyncSlice';

const slice = createAsyncSlice({
  name: 'categories',
  fetchConfig: () => CATEGORIES_GET(),
});

export const fetchCategories = slice.asyncAction;

export default slice.reducer;
