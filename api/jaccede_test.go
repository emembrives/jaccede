package api

import (
	"net/url"
	"testing"
	"time"
)

func TestHMAC(t *testing.T) {
	var client JaccedeClient = NewClient()
	url, err := url.Parse("http://api.jaccede.com/v2/places/search/?offset=0&limit=30&longitude=2.0803939&latitude=48.7176771&distance=20&cat_id=27&lang=fr")
	if err != nil {
		panic(err)
	}
	header := client.computeHeader(url, time.Unix(1357990992162, 0))
	if header.Get("x-jispapi-timestamp") != "1357990992162" {
		t.Errorf("x-jispapi-timestamp is %q.",
			header.Get("x-jispapi-timestamp"))
	}

	if header.Get("Authorization") != "JISPAPI test-jispapi-access-key-id:YWMwYzcwOTgxYzgwOWU4NDQ4Yzk3N2UwOWQzNDM3N2ExMjAwODQ2NA==" {
		t.Errorf("Authorization is %q.",
			header.Get("Authorization"))
	}
}
