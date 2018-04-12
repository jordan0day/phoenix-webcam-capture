defmodule WebcamCaptureWeb.PageController do
  use WebcamCaptureWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
