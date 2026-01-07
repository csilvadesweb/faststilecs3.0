package com.faststile.cs

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
 override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  val webView = WebView(this)
  setContentView(webView)

  webView.settings.javaScriptEnabled = true
  webView.settings.domStorageEnabled = true
  webView.webViewClient = WebViewClient()

  webView.loadUrl("https://csilvadesweb.github.io/faststilecs3.0/")
 }
}