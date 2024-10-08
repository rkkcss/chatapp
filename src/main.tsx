import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import store from './store/store.ts';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#9333ea',
            colorPrimaryHover: '#7e22ce',
          },
          components: {
            // Button: {
            //   borderRadius: 8,
            //   defaultColor: '#9333ea',
            //   defaultBorderColor: '#9333ea'
            // },
            Segmented: {
              itemSelectedBg: '#9333ea',
              itemSelectedColor: 'white',
            }
          }
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
  ,
)
