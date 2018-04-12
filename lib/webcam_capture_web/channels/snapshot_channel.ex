defmodule WebcamCaptureWeb.SnapshotChannel do
  use WebcamCaptureWeb, :channel

  def join("snapshot", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("snapped", payload, socket) do
    now = DateTime.utc_now() |> DateTime.to_unix()
    mime_type = payload["mime_type"]
    extension = String.trim_leading(mime_type, "image/")
    filename = "#{now}.#{extension}"
    data = payload["data"]
    File.write(filename, data)

    {:noreply, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (snapshot:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
