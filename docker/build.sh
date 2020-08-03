docker build -t registry.cn-shanghai.aliyuncs.com/first_ry/music:v1 .
docker run -d -p 2000:5000 --name music registry.cn-shanghai.aliyuncs.com/first_ry/music:v1
docker push registry.cn-shanghai.aliyuncs.com/first_ry/music:v1

version: '2'

services:
  mblog:
    image: registry.cn-shanghai.aliyuncs.com/first_ry/music:v1
    restart: always
    ports:
      - 2000:5000