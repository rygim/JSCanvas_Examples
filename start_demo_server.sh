

export ip=`ifconfig | awk 'NR==2 {print $2}' | grep -G [0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]* -o`

export port=7777

sudo iptables -A INPUT -p tcp -d 0/0 -s 0/0 --dport $port -j ACCEPT

echo "Running canvas presentation on $ip:$port"




node canvaspresentation.server.js $ip $port &
 


