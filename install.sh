#!/bin/bash
echo "Downloading CPUStatX..."
wget -q https://nated.in/downloads/cpustatx-linux.tar.gz -O cpustatx-linux.tar.gz
tar -xzf cpustatx-linux.tar.gz
chmod +x cpustatx-linux
sudo mv cpustatx-linux /usr/local/bin/cpustatx
echo "Installation complete! Run 'cpustatx' to start monitoring."
