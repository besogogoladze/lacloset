import { Button } from "antd";
import React from "react";
import { Link } from "react-router";

function Error404() {
  return (
    <div>
      <h1>Error 404: Page Not Found</h1>
      <Button type="primary">
        <Link to="/">Go back to Home</Link>
      </Button>
    </div>
  );
}

export default Error404;
