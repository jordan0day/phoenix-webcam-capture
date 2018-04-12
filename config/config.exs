# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :webcam_capture, WebcamCaptureWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Owm93GwwP3y5vTc6iARCAIOXsyqVRzAgJNO9EQVZkU1hnf/3Pd/8twkfjq31aULB",
  render_errors: [view: WebcamCaptureWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: WebcamCapture.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
