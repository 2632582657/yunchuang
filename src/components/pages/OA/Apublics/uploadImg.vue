<!--@description: 上传图片
	@author: 李瑞军
  @update: 李瑞军(2019-06-24 16:41) -->
<template>
    <div>
        <el-upload
            ref="upload"
            :action="uploadImg"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-success="handleUploadSuccess"
            :data="fileList"
            :on-remove="handleRemove"
            :file-list="draftImg"
            name="images"
            :headers="head"
        >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'uploadImg',
    data() {
        return {
            dialogImageUrl: '', // 查看图片
            dialogVisible: false,
            imgUrl: [], // 上传图片路径
            draftImg: [],
            head: {
                // "Content-Type":"application",
                Sign: '',
                Platform: 'H5',
                Timestamp: new Date().getTime(),
                Device: '',
                Access_Token: sessionStorage.getItem('token')
            }
        }
    },
    // created:{
    //      imgUrl: [],
    // }
    methods: {
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        handleUploadSuccess(response) {
            if (response.code === 200 && response.sysCode === 200) {
                response.data.forEach(item => {
                    if (this.imgUrl != Array) {
                        this.imgUrl = []
                        
                    }
                    this.imgUrl.push(item.absolutePath)
                })
            }
            // if (response.data.code === 200 ) {
            //     this.imgUrl.push(response.data[0].absolutePath)
            // }
        },
        clearFile() {
            this.$refs.upload.clearFiles()
        },
        handleRemove(file, fileList) {
            if (file.response) {
                let index = this.imgUrl.indexOf(
                    file.response.data[0].absolutePath
                )
                this.imgUrl.splice(index, 1)
                this.draftImg.splice(index, 1)
            } else {
                let index = this.draftImg.indexOf(file.url)
                this.draftImg.splice(index, 1)
                this.imgUrl.splice(index, 1)
            }
        }
    },
    props: {
        uploadImg: {
            type: String,
            required: true
        },
        fileList: {
            type: Object,
            default: () => ({
                path: ''
            })
        }
    }
}
</script>

<style>
</style>
