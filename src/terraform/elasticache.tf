resource "aws_elasticache_cluster" "our-cache" {
  port            = 11211
  engine          = "memcached"
  node_type       = "cache.t3.small"
  cluster_id      = "our-cache-cluster"
  num_cache_nodes = 1
}
