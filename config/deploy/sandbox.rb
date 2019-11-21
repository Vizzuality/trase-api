server 'ec2-34-216-27-79.us-west-2.compute.amazonaws.com', user: 'ubuntu', roles: %w{web app db}, primary: true
server 'ec2-34-223-6-56.us-west-2.compute.amazonaws.com', user: 'ubuntu', roles: %w{web app}, primary: false

set :ssh_options, forward_agent: true

set :branch, 'develop'
