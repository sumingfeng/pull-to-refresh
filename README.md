# pull-to-refresh

移动端下拉刷新,基于Zepto,demo截图如下：

![image](https://github.com/sumingfeng/pull-to-refresh/blob/master/images/thumb.jpg)

使用说明：

    $(obj).Su_pull({
        
        diff:"60" //下拉到多少距离进行滑块变换
        
    },function(s,w){
    
        alert("回调进行ajax数据操作...")
    })
