import axios from 'axios';

declare global {
  var mockedAxios: jest.Mocked<typeof axios>;
}

jest.mock('axios');
global.mockedAxios = axios as jest.Mocked<typeof axios>;
