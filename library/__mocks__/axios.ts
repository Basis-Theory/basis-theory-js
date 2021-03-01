import type axios from 'axios';

const mockAxios = jest.genMockFromModule('axios') as typeof axios;
// mock creation of axios instances
mockAxios.create = jest.fn(() => mockAxios);

export default mockAxios;
