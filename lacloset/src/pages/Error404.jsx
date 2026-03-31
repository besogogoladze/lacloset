import { Button } from "antd";
import React from "react";
import { Link } from "react-router";

function Error404() {
  return (
    <div>
      <h1>Error 404: გვერდი ვერ მოიძებნა</h1>
      <Button type="primary">
        <Link to="/">დაბრუნება მთავარ გვერდზე</Link>
      </Button>
    </div>
  );
}

export default Error404;
