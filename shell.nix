{ pkgs ? import <nixpkgs> {} }:

with pkgs;

stdenv.mkDerivation {
  name = "grafana-pcp-live";

  buildInputs = [
    nodejs-8_x
  ];
}
