import reducer from "../../features/authSlice";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../Login";

// test initial state 
const myTestInitVal = {
  user: null,
  isLoggedIn: false,
  status: "idle",
  error: null,
};

test("Should return initial state", () => {
  expect(
    reducer(undefined, { type: undefined })
  ).toEqual(myTestInitVal);
});

//  mock store 
const myStore = configureStore({
  reducer: {
    auth: reducer
  },
  preloadedState: {
    auth: {
      user: null,
      isLoggedIn: false,
      status: "idle",
      error: null
    }
  }
});

test("To test username is valid", () => {
  render(
    <Provider store={myStore}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );

  const userEmailInput = screen.getByPlaceholderText("Email");
  expect(userEmailInput).toBeInTheDocument();
  expect(userEmailInput.value).toBe("");

});

// Snapshot test for Login UI
test("snapshot of Login.js UI", () => {
  const { container } = render(
    <Provider store={myStore}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </Provider>
  );
  expect(container).toMatchSnapshot();
});
